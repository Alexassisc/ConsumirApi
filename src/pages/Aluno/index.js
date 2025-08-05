import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt } from 'validator';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import api from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Aluno({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState('');

  const emailModified = useSelector((state) => state.auth.emailModified);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/alunos/${id}`);

        const fotosArray = get(data, 'fotos', []);
        const ultimaFoto = fotosArray.length > 0 ? fotosArray[fotosArray.length - 1].url : '';
        setFoto(ultimaFoto);

        setNome(data.nome);
        setEmail(data.email);
        setIdade(data.idade);
      } catch (err) {
        const status = get(err, 'response.status', 0);
        const msg = get(err, 'response.data.msg', []);

        if (status === 400 || status === 404) {
          if (Array.isArray(msg)) {
            msg.forEach((error) => toast.error(error));
          } else {
            toast.error(msg || 'Aluno não encontrado');
          }
          history.push('/');
        } else if (status === 401) {
          toast.error('Você precisa fazer login novamente');
        } else {
          toast.error('Erro inesperado ao carregar dados do aluno.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      toast.error('Nome deve ter entre 3 e 255 caracteres');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('E-mail inválido');
      formErrors = true;
    }

    if (!isInt(String(idade), { min: 0 })) {
      toast.error('Idade inválida');
      formErrors = true;
    }

    if (emailModified) {
      toast.error(
        'Você alterou o e-mail e precisa fazer login novamente para criar ou editar alunos.',
      );
      return;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await api.put(`/alunos/${id}`, { nome, email, idade });
        toast.success('Aluno(a) editado com sucesso!');
      } else {
        await api.post('/alunos', {
          nome,
          email,
          idade,
        });
        toast.success('Aluno(a) criado(a) com sucesso!');
      }
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const msg = get(data, 'msg', {});

      if (Array.isArray(msg)) {
        msg.forEach((error) => toast.error(error));
      } else {
        toast.error(msg || 'Erro ao processar requisição');
      }

      if (status === 401) dispatch(actions.registerOrUpdateFailure());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar aluno' : 'Novo Aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}

          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
          min="0"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
