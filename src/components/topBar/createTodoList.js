// @flow
import React, { useState } from "react"

import Tooltip from "@material-ui/core/Tooltip"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import TextField from "@material-ui/core/TextField"

import { makeStyles } from "@material-ui/styles"

import TodoListModel from "../../shared/models/todoList"
import Storage from "../../backend/storage"

type Props = {
  onCreateTodoList: (newList: TodoListModel) => void
}

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    },
    margin: {
      marginLeft: 20,
      width: "90%"
    }
  }
})

const nameRef = React.createRef()

const CreateTodoList = (props: Props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const storage = new Storage()
  storage.setModalIsOpen(isOpen)

  const createList = () => {
    const newList = new TodoListModel({ name: nameRef.current.value })
    props.onCreateTodoList(newList)
    setIsOpen(false)
  }

  return (
    <React.Fragment>
      <Tooltip disableFocusListener={true} title="Create new todolist">
        <IconButton className={classes.icon} onClick={toggleOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth maxWidth="sm" onClose={toggleOpen} open={isOpen}>
        <DialogTitle>Create New Todolist</DialogTitle>
        <TextField label="Name" margin="dense" autoFocus className={classes.margin} autoComplete="off" inputRef={nameRef} />

        <DialogActions>
          <Button color="primary" onClick={createList}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CreateTodoList
