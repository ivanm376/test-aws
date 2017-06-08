import config from '../config'
import AWS from 'aws-sdk'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { browserHistory } from 'react-router'

AWS.config.region = config.region

export const setUsername = value => {
  return {
    type: 'SET_USERNAME',
    value
  }
}

export const setPassword = value => {
  return {
    type: 'SET_PASSWORD',
    value
  }
}

export const loginSuccess = value => {
  return {
    type: 'LOGIN_SUCCESS',
  }
}

export const loginFail = value => {
  return {
    type: 'LOGIN_FAIL',
    value
  }
}

export const signout = value => {
  return (dispatch, getState) => {
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
}

export const getCredentials = idToken => {
  return (dispatch, getState) => {
    dispatch({ type: 'RECEIVING_CREDENTIALS', value: true })
    const Logins = {}
    Logins['cognito-idp.' + config.region + '.amazonaws.com/' + config.UserPoolId] = idToken
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId,
      Logins,
    })
    AWS.config.credentials.get(err => {
      if (err) {
        browserHistory.push('/login')
        dispatch(loginFail(JSON.stringify(err)))
      } else {
        const credentials = AWS.config.credentials
//           console.log({ credentials })
        const apigClient = window.apigClientFactory.newClient({
          accessKey: credentials.accessKeyId,
          secretKey: credentials.data.Credentials.SecretKey,
          sessionToken: credentials.sessionToken,
          region: config.region,
        })
        browserHistory.getCurrentLocation().pathname === '/login' && browserHistory.push('/')
        dispatch(loginSuccess())
        dispatch({ type: 'RECEIVING_IDENTITY_DATA' })
        apigClient.identityGet().then(data => {
          dispatch({ type: 'RECEIVING_IDENTITY_DATA_SUCCESS', value: JSON.stringify(data) })
        }).catch(err => dispatch({ type: 'RECEIVING_IDENTITY_DATA_FAIL' }))
      }
    })
  }
}

export const setCognitoUser = value => {
  const Pool = new CognitoUserPool(config)
  const cognitoUser = new CognitoUser({ Username: value, Pool })
  return {
    type: 'SET_COGNITO_USER',
    value: cognitoUser
  }
}

export const checkLocalStorage = value => {
  return (dispatch, getState) => {
    const user = localStorage['CognitoIdentityServiceProvider.' + config.ClientId + '.LastAuthUser']
    const idToken = localStorage['CognitoIdentityServiceProvider.' + config.ClientId + '.' + user + '.idToken']
    if (idToken) {
      dispatch(setCognitoUser(user))
      dispatch(getCredentials(idToken))
    }
  }
}

export const login = (Username, Password) => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOGIN' })
    setTimeout(() => {
      const authenticationDetails = new AuthenticationDetails({ Username, Password })
      dispatch(setCognitoUser(Username))
      const { auth: { cognitoUser }} = getState()
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          dispatch(getCredentials(result.idToken.jwtToken))
        },
        onFailure: err => {
          dispatch(loginFail(err.message));
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
          cognitoUser.completeNewPasswordChallenge(Password, null, this)
        },
      })
    }, 50)
  }
}
