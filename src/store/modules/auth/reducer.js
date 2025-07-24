import * as types from '../types';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      console.log('Login em andamento...');
      return {
        ...state,
        isLoading: true,
      };

    case types.LOGIN_SUCCESS:
      console.log('Login realizado com sucesso!');
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
      };

    case types.LOGIN_FAILURE:
      console.log('Erro ao fazer login.');
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: null,
      };

    default:
      return state;
  }
}
