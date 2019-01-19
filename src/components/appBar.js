// @flow
import React, { useState } from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
})

const TopBar = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Ultralist
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopBar