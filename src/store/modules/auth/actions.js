import * as types from '../types';

export function loginRequest(payload) {
  return {
    type: types.LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload) {
  return {
    type: types.LOGIN_SUCCESS,
    payload,
  };
}

export function loginFailure(payload) {
  return {
    type: types.LOGIN_FAILURE,
    payload,
  };
}

export function registerOrUpdateRequest(payload) {
  return {
    type: types.REGISTER_OR_UPDATE_REQUEST,
    payload,
  };
}

export function registerOrUpdateSuccess(payload) {
  return {
    type: types.REGISTER_OR_UPDATE_SUCCESS,
    payload,
  };
}

export function registerOrUpdateFailure() {
  return {
    type: types.REGISTER_OR_UPDATE_FAILURE,
  };
}
export function logout() {
  return {
    type: types.LOGOUT,
  };
}
