import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('O nome deve ter entre 3 e 255 caracteres.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('O e-mail informado é inválido.');
    }

    if (senha.length < 6 || senha.length > 50) {
      formErrors = true;
      toast.error('A senha deve ter entre 6 e 50 caracteres.');
    }

    if (formErrors) return;

    try {
      await axios.post('api/auth/register', {
        nome,
        senha,
        email,
      });
      toast.success('Cadastro realizado!');
      history.push('/login');
    } catch (e) {
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
    }
  }

  return (
    <Container>
      <h1>Crie sua conta </h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </label>

        <label htmlFor="senha">
          Senha:
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        <button type="submit">Criar conta</button>
      </Form>
    </Container>
  );
}
