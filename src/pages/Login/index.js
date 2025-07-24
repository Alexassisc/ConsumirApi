import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';
import api from '../../services/axios';
import history from '../../services/history';

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido.');
    }

    if (senha.length < 6 || senha.length > 50) {
      formErrors = true;
      toast.error('Senha inválida.');
    }

    if (formErrors) return;

    dispatch(actions.loginRequest({email, senha}));

    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token } = response.data;

      localStorage.setItem('token', token);
      toast.success('Login realizado com sucesso!');

      setEmail('');
      setSenha('');

      history.push('/');
    } catch (err) {
      const message = get(err, 'response.data.message');

      if (Array.isArray(message)) {
        message.forEach((error) => toast.error(error));
      } else if (typeof message === 'string') {
        toast.error(message);
      } else if (message) {
        toast.error(String(message));
      } else {
        toast.error('Erro ao realizar login.');
      }
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu E-mail"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Sua Senha"
          required
        />
        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
