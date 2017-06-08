export default (state = {}, action) => {
  const types = {
    SET_USERNAME:  { username: action.value },
    SET_PASSWORD:  { password: action.value },

    LOGIN:             { loggingIn: true },
    LOGIN_CREDENTIALS: { receivingCredentials: true },
    LOGIN_SUCCESS:     { loggingIn: false, receivingCredentials: false, loginError: '' },
    LOGIN_FAIL:        { loggingIn: false, receivingCredentials: false, loginError: action.value, cognitoUser: '' },
    LOGOUT:            { loggingIn: false, cognitoUser: '', identityData: '', loginError: '' },


    SET_COGNITO_USER: { cognitoUser: action.value },

    RECEIVING_IDENTITY_DATA:         { receivingIdentityData: true },
    RECEIVING_IDENTITY_DATA_SUCCESS: { receivingIdentityData: false, identityData: action.value  },
    RECEIVING_IDENTITY_DATA_FAIL:    { receivingIdentityData: false,
      receivingIdentityDataError: action.value || 'Error: Identity data receiving error' },
    SET_LOGIN_ERROR: { loginError: action.value },
  }

  const update = types[action.type]
  if (update) {
    return Object.assign({}, state, update)
  }

  return state
}
