export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return Object.assign({}, state, {
        username: action.value,
      })
    case 'SET_PASSWORD':
      return Object.assign({}, state, {
        password: action.value,
      })
    case 'LOGIN':
      return Object.assign({}, state, {
        loggingIn: true,
      })
    case 'SET_COGNITO_USER':
      return Object.assign({}, state, {
        cognitoUser: action.value
      })
    case 'RECEIVING_CREDENTIALS':
      return Object.assign({}, state, {
        loggingIn: true,
        receivingCredentials: action.value
      })
    case 'RECEIVING_IDENTITY_DATA':
      return Object.assign({}, state, {
        receivingIdentityData: true,
      })
    case 'RECEIVING_IDENTITY_DATA_SUCCESS':
      return Object.assign({}, state, {
        identityData: action.value,
        receivingIdentityData: false,
      })
    case 'RECEIVING_IDENTITY_DATA_FAIL':
      return Object.assign({}, state, {
        receivingIdentityData: false,
        receivingIdentityDataError: 'Error: Identity data receiving error'
      })
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        loggingIn: false,
        receivingCredentials: false,
        loginError: '',
      })
    case 'LOGIN_FAIL':
      return Object.assign({}, state, {
        loggingIn: false,
        cognitoUser: '',
        receivingCredentials: false,
        loginError: action.value,
      })
    case 'LOGOUT':
      return Object.assign({}, state, {
        loggingIn: false,
        cognitoUser: '',
        identityData: '',
        loginError: '',
      })
    case 'SET_LOGIN_ERROR':
      return Object.assign({}, state, {
        loginError: action.value,
      })
    default:
      return state
  }
}
