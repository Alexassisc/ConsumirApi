import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';


export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

const handleSubmit = (e) => {
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

  dispatch(actions.loginRequest({ email, senha }));
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
