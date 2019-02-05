// @flow

import { withStyles } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import blue from "@material-ui/core/colors/blue"

import TodoText from "../basic/todoText"

const styles = () => ({
  project: {
    color: red[500],
    cursor: "pointer"
  },
  context: {
    color: blue[500],
    cursor: "pointer"
  },
  strike: {
    textDecoration: "line-through"
  },
  grey: {
    color: "#aaa"
  },
  bold: {
    fontWeight: "bold"
  }
})

export default withStyles(styles)(TodoText)
