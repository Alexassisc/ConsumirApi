import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import api from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [isLoading, setIsLoading] = useState(false);
  const [fotos, setFoto] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/alunos/${id}`);
        const fotosArray = get(data, 'fotos', []);
        const ultimaFoto =
          fotosArray.length > 0 ? fotosArray[fotosArray.length - 1].url : '';
        setFoto(ultimaFoto);
        setIsLoading(false);
      } catch {
        toast.error('Erro ao obter imagem');
        setIsLoading(false);
        history.push('/');
      }
    };
    getData();
  }, [id]);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    setFoto(previews[0]);

    const formData = new FormData();
    formData.append('alunoId', id);

    files.forEach((file) => {
      formData.append('fotos', file);
    });

    try {
      setIsLoading(true);
      await api.post('/fotos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Fotos enviadas com sucesso!');
    } catch (err) {
      toast.error('Erro ao enviar as fotos');

      const { status } = get(err, 'response', '');
      if (status === 401) dispatch(actions.loginFailure());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Fotos</Title>

      <Form>
        <label htmlFor="fotos">
          {fotos ? <img src={fotos} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="fotos" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
