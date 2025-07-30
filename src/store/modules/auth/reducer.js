import * as types from '../types';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
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
      };

    case types.REGISTER_OR_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user || state.user,  // Atualiza os dados do usuário
        email: action.payload.email,
      };

    case types.LOGIN_FAILURE:
    case types.REGISTER_OR_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
