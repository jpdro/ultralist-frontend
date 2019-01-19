// @flow
import TodoList, { createTodoListFromJSON } from "../models/todoList"

export default class Storage {
  loadTodoLists() {
    const rawLists = JSON.parse(window.localStorage.getItem("todolists"))
    return rawLists.map(list => createTodoListFromJSON(list))
  }

  saveTodoLists(todoLists: Array<TodoList>) {
    const storageJSON = todoLists.map(list => list.toJSON())
    window.localStorage.setItem("todolists", JSON.stringify(storageJSON))
  }

  updateTodoList(todoList: TodoList) {
    const lists = this.loadTodoLists()
    const index = lists.map(l => l.uuid).indexOf(todoList.uuid)
    lists[index] = todoList
    this.saveTodoLists(lists)
  }
}