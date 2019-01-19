// @flow
import React from "react"
import { BACKEND_URL } from "../constants"

const Login = () => {
  return (
    <React.Fragment>
      <h1>Login page</h1>
      <a href={`${BACKEND_URL}/users/auth/google_oauth2`}>Login with google</a>
    </React.Fragment>
  )
}

export default Login