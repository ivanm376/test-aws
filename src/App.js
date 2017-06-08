import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  render() {
    const { location: { pathname }, auth: {
        loggingIn, cognitoUser, identityData, receivingCredentials,
        receivingIdentityData, receivingIdentityDataError, loginError
      },
    } = this.props
    console.log()
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <div className="App-intro">
            <div>
              <div>Test Application</div>
              <div className="loggedInAs">
                <div>{cognitoUser && (loggingIn ? 'Logging' : 'Logged') + ' in as: ' + cognitoUser.username}</div>
                {!loggingIn && (cognitoUser ? <Link to="/logout">Log Out</Link>
                                            : <Link to="/login">Login</Link>)}
                {pathname !== '/' &&  <Link to="/">Back</Link>}
              </div>
            </div>
          </div>
          <div className="App-childs">
            {this.props.children}
          </div>
          <div className="App-data">
            <div>{receivingCredentials && 'Receiving credentials, please wait.'}</div>
            <div>{receivingIdentityData && 'Receiving Identity data'}</div>
            <div className="error">{receivingIdentityDataError}</div>
            <div className="error">{loginError}</div>
            <div style={{ wordWrap: 'break-word' }}>{identityData}</div>
          </div>
        </div>
        <div className="App-footer"></div>
      </div>
    )
  }
}

export default connect(state => state)(App)
