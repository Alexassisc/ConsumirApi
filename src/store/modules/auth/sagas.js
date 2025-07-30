import { call, put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import { toast } from 'react-toastify';
import api from '../../../services/axios';
import history from '../../../services/history';
import { get } from 'lodash';

// Login Saga
function* loginRequest({ payload }) {
  try {
    const response = yield call(api.post, '/auth/login', payload);

    if (!response.data.token) {
      throw new Error('Token não recebido');
    }

    yield put(
      actions.loginSuccess({
        token: response.data.token,
        user: response.data.user,
      }),
    );

    toast.success('Login realizado com sucesso!');

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    history.push('/');
  } catch (error) {
    toast.error('Falha no login, verifique seus dados.');
    yield put(actions.loginFailure());
  }
}

// Novo Saga: Register ou Update
function* registerOrUpdateRequest({ payload }) {
  const { id, nome, email, senha } = payload;

  try {
    if (id) {
      // Atualização de usuário
      const response = yield call(api.put, `/auth/usuarios/${id}`, {
        nome,
        email,
        senha: senha || undefined,
      });

      toast.success('Dados atualizados com sucesso!');

      yield put(actions.registerOrUpdateSuccess({ user: response.data }));
    } else {
      // Registro de novo usuário
      yield call(api.post, '/auth/register', {
        nome,
        email,
        senha,
      });

      toast.success('Cadastro realizado!');
      history.push('/login');

      yield put(actions.registerOrUpdateSuccess({ user: null }));
    }
  } catch (e) {
    console.error('Erro capturado:', e);

    const message = get(e, 'response.data.message');

    if (Array.isArray(message)) {
      message.forEach((error) => toast.error(error));
    } else if (typeof message === 'string') {
      toast.error(message);
    } else if (message) {
      toast.error(String(message));
    } else {
      toast.error('Erro desconhecido');
    }

    yield put(actions.registerOrUpdateFailure());
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.REGISTER_OR_UPDATE_REQUEST, registerOrUpdateRequest),
]);
