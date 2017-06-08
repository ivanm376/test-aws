import { browserHistory } from 'react-router'
import config from '../config'
import AWS from 'aws-sdk'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
AWS.config.region = config.region

const loginFail = value => ({ type: 'LOGIN_FAIL', value })
const getCredentials = idToken => dispatch => {
  dispatch({ type: 'LOGIN_CREDENTIALS' })
  const Logins = {}
  Logins['cognito-idp.' + config.region + '.amazonaws.com/' + config.UserPoolId] = idToken
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.IdentityPoolId,
    Logins
  })
  AWS.config.credentials.get(err => {
    if (err) {
      browserHistory.push('/login')
      dispatch(loginFail(JSON.stringify(err)))
    } else {
      const credentials = AWS.config.credentials
      // console.log(credentials)
      const apigClient = window.apigClientFactory.newClient({
        accessKey: credentials.accessKeyId,
        secretKey: credentials.data.Credentials.SecretKey,
        sessionToken: credentials.sessionToken,
        region: config.region,
      })
      browserHistory.getCurrentLocation().pathname === '/login' && browserHistory.push('/')
      dispatch({ type: 'LOGIN_SUCCESS' })
      dispatch({ type: 'RECEIVING_IDENTITY_DATA' })
      apigClient.identityGet().then(result => dispatch({
        type: 'RECEIVING_IDENTITY_DATA_SUCCESS',
        value: JSON.stringify(result.data)
      })).catch(err => dispatch({ type: 'RECEIVING_IDENTITY_DATA_FAIL', value: err.toString() }))
    }
  })
}

const setCognitoUser = Username => {
  const Pool = new CognitoUserPool(config)
  const value = new CognitoUser({ Username, Pool })
  return { type: 'SET_COGNITO_USER', value }
}

export const login = (Username, Password) => (dispatch, getState) => {
  dispatch({ type: 'LOGIN' })
  setTimeout(() => {
    const authenticationDetails = new AuthenticationDetails({ Username, Password })
    dispatch(setCognitoUser(Username))
    const { auth: { cognitoUser }} = getState()
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => dispatch(getCredentials(result.idToken.jwtToken)),
      onFailure: err => dispatch(loginFail(err.message)),
      newPasswordRequired: (userAttributes, requiredAttributes) =>
        cognitoUser.completeNewPasswordChallenge(Password, null, this)
    })
  }, 50)
}

export const checkLocalStorage = value => dispatch => {
  const Username = localStorage['CognitoIdentityServiceProvider.' + config.ClientId + '.LastAuthUser']
  const idToken = localStorage['CognitoIdentityServiceProvider.' + config.ClientId + '.' + Username + '.idToken']
  if (idToken) {
    dispatch(setCognitoUser(Username))
    dispatch(getCredentials(idToken))
  }
}

export const logout = value => (dispatch, getState) => {
  dispatch({ type: 'LOGOUT' })
  setTimeout(() => {
    const { auth: { cognitoUser }} = getState()
    cognitoUser && cognitoUser.signOut()
    AWS.config.credentials && AWS.config.credentials.clearCachedId()
    const lastAuthUser = 'CognitoIdentityServiceProvider.' + config.ClientId + '.LastAuthUser'
    const key = 'CognitoIdentityServiceProvider.' + config.ClientId + '.' + localStorage[lastAuthUser]
    localStorage.removeItem(lastAuthUser)
    localStorage.removeItem(key + '.idToken')
    localStorage.removeItem(key + '.accessToken')
    localStorage.removeItem(key + '.refreshToken')
    browserHistory.push('/login')
  }, 50)
}
