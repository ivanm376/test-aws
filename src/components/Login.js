import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login } from '../actions/auth'

class Login extends Component {
  login() {
    this.props.dispatch(login(this.state.username, this.state.password))
  }

  render() {
    const { auth: { loggingIn }} = this.props
    return (
      <div className="Login">
        <div>
          <input placeholder="username" disabled={loggingIn ? true : false}
            onChange={e => this.setState({ username: e.target.value})}/>
        </div>
        <div>
          <input placeholder="password" type="password" disabled={loggingIn ? true : false}
            onChange={e => this.setState({ password: e.target.value})}/>
        </div>
        <div>
          <button disabled={loggingIn ? true : false}
            onClick={this.login.bind(this)}>login</button>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Login)
