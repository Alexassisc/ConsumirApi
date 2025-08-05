import * as types from '../types';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  emailModified: false, // flag para controle de modificação do email
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
    case types.REGISTER_OR_UPDATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user || null,
        emailModified: false, // reseta a flag no login
      };

    case types.REGISTER_OR_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user || state.user,
      };

    case types.LOGIN_FAILURE:
    case types.REGISTER_OR_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        emailModified: false,
      };

    case types.EMAIL_CHANGED:
      return {
        ...state,
        emailModified: action.payload, // atualiza flag conforme payload
      };

    default:
      return state;
  }
}
