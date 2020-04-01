// @flow
import React, { useState, useEffect } from "react"
import { parseISO } from "date-fns"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import grey from "@material-ui/core/colors/grey"

import Backend from "../shared/backend/backend"
import Storage from "../backend/storage"
import TestBackend from "../backend/testBackend"
import EventCache from "../shared/backend/eventCache"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoList from "../components/topBar/createTodoList"

import { createAddEvent, createUpdateEvent, createDeleteEvent } from "../shared/models/todoEvent"
import TodoItemModel from "../shared/models/todoItem"
import { loadUser } from "../shared/models/user"
import TodoListModel, { createTodoListFromBackend } from "../shared/models/todoList"

import { WebsocketProcessor } from "../config/websocket"

type Props = {
  backend?: TestBackend
}

const eventCache = new EventCache()
const storage = new Storage()
const TODOLIST_MRU_KEY = "todolist-mru-id"

const useStyles = makeStyles({
  greyBackground: {
    backgroundColor: grey[200],
    height: "100vh"
  }
})

const TodoListApp = (props: Props) => {
  const classes = useStyles()
  const todoLists = storage.loadTodoLists()
  let mostRecentTodoList
  if (props.match.params.id) {
    mostRecentTodoList = todoLists.find(t => t.uuid === props.match.params.id)
    window.localStorage.setItem(TODOLIST_MRU_KEY, mostRecentTodoList.uuid)
  } else {
    mostRecentTodoList = todoLists.find(tl => tl.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY))
  }

  const [todoList, setTodoList] = useState(mostRecentTodoList || todoLists[0])

  const user = loadUser()
  window.socket.registerSocket(user)
  const backend = props.backend || new Backend(user.token)

  const fetchList = (list: TodoListModel, cb) => {
    if (!navigator.onLine) return

    backend.fetchTodoList(list.uuid).then(l => {
      l = createTodoListFromBackend(l)
      storage.updateTodoList(l)
      if (cb) cb(l)
    })
  }

  const fetchLists = () => {
    backend.fetchTodoLists().then(todoLists => {
      const lists = todoLists.todolists.map(list => createTodoListFromBackend(list))
      const currentList = lists.find(l => l.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY))
      storage.saveTodoLists(lists)
      setTodoList(currentList)
    })
  }

  const processSocketUpdate = data => {
    setTimeout(() => {
      const updatedAt = parseISO(data.data.updated_at)
      const updatedList = storage.loadTodoList(data.data.uuid)
      if (updatedAt > updatedList.updatedAt) {
        if (updatedList.uuid === todoList.uuid) {
          fetchList(updatedList, list => setTodoList(list))
        } else {
          fetchList(updatedList)
        }
      }
    }, 500)
  }

  useEffect(() => {
    fetchLists()

    const socketProcessor = new WebsocketProcessor("todolist_update", processSocketUpdate)
    window.socket.registerProcessor(socketProcessor)

    return () => {
      window.socket.deregisterProcessor("todolist_update")
    }
  }, [])

  const update = () => {
    if (!navigator.onLine) return

    backend.updateTodoList(todoList.uuid, eventCache).then(list => {
      const newTodoList = createTodoListFromBackend(list)
      storage.updateTodoList(newTodoList)
      setTodoList(newTodoList)
      eventCache.clear()
    })
  }

  const onAddTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createAddEvent(todoItem))
    update()
  }

  const onChangeTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createUpdateEvent(todoItem))
    update()
  }

  const onDeleteTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createDeleteEvent(todoItem))
    update()
  }

  const onChangeTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    setTodoList(newList)
    fetchList(newList, list => setTodoList(list))
  }

  const onCreateTodoList = (todoList: TodoListModel) => {
    backend.createTodoList(todoList.uuid, todoList.name).then(todoList => {
      todoList = createTodoListFromBackend(todoList)
      const lists = storage.loadTodoLists()
      lists.push(todoList)
      storage.saveTodoLists(lists)
      props.enqueueSnackbar("Todolist created.")
      setTodoList(todoList)
    })
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <CreateTodoList onCreateTodoList={onCreateTodoList} />
          <TodoListChooser todoLists={todoLists} onSelectTodoList={onChangeTodoList} />
          <UserIcon />
        </TopBar>

        <TodoList todoList={todoList} onAddTodoItem={onAddTodoItem} onChangeTodoItem={onChangeTodoItem} onDeleteTodoItem={onDeleteTodoItem} />
      </div>
    </React.Fragment>
  )
}
export default withSnackbar(TodoListApp)
