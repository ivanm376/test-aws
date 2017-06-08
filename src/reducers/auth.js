export default (state = {}, action) => {
  const value = action && action.value
  const reducers = {
    SET_USERNAME:  { username: value },
    SET_PASSWORD:  { password: value },
    LOGIN:             { loggingIn: true },
    LOGIN_CREDENTIALS: { loggingIn: true,  receivingCredentials: true },
    LOGIN_SUCCESS:     { loggingIn: false, receivingCredentials: false, loginError: '' },
    LOGIN_FAIL:        { loggingIn: false, receivingCredentials: false, loginError: value, cognitoUser: '' },
    LOGOUT:            { loggingIn: false, identityData: '',            loginError: '',    cognitoUser: '' },
    SET_COGNITO_USER:  { cognitoUser: value },
    RECEIVING_IDENTITY_DATA:         { receivingIdentityData: true },
    RECEIVING_IDENTITY_DATA_SUCCESS: { receivingIdentityData: false, identityData: value  },
    RECEIVING_IDENTITY_DATA_FAIL:    { receivingIdentityData: false, receivingIdentityDataError: value },
  }
  const update = reducers[action.type]
  if (update) {
    return Object.assign({}, state, update)
  }
  return state
}
