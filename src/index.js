import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import { checkLocalStorage, signout } from './actions/auth'
import auth from './reducers/auth'

import App from './App'
import Home from './components/Home'
import Login from './components/Login'
import NoMatch from './components/NoMatch'
import './index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const initialState = {}
const store = createStore(
  combineReducers({
    auth,
  }),
  initialState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={() => store.dispatch(checkLocalStorage())}>
        <IndexRoute component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/signout" onEnter={() => store.dispatch(signout())}/>
        <Route path="*" component={NoMatch}/>
      </Route>
    </Router>
  </Provider>
, document.getElementById('root'))
