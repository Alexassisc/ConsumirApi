import * as types from '../types';
import axios from 'axios';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
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

    case types.LOGIN_FAILURE:
      delete axios.defaults.headers.Authorization;
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
      };

    default:
      return state;
  }
}
