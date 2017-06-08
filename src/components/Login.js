import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setUsername, setPassword, login } from '../actions/auth'

class Login extends Component {
  render() {
    const { dispatch, auth: { username, password, loggingIn }} = this.props
    return (
      <div className="Login">
        <div>
          <input placeholder="username"
            onChange={e => dispatch(setUsername(e.target.value))}/>
        </div>
        <div>
          <input placeholder="password" type="password"
            onChange={e => dispatch(setPassword(e.target.value))}/>
        </div>
        <div>
          <button disabled={loggingIn ? true : false}
            onClick={e => dispatch(login(username, password))}>login</button>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Login)
