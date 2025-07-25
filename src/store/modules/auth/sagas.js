import { call, put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(api.post, '/auth/login', payload);

    if (!response.data.token) {
      throw new Error('Token não recebido');
    }

    yield put(actions.loginSuccess({ token: response.data.token }));
    toast.success('Login realizado com sucesso!');

    localStorage.setItem('token', response.data.token);

    history.push('/');
  } catch (error) {
    toast.error('Falha no login, verifique seus dados.');
    yield put(actions.loginFailure());
  }
}

export default all([takeLatest(types.LOGIN_REQUEST, loginRequest)]);


