import React, { useEffect, useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import api from '../../services/axios';
import { AlunoContainer, ProfilePicture } from './styled';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      try {
        const response = await api.get('/alunos');
        setAlunos(response.data);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err.response || err);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, []);


  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.delete(`/alunos/${id}`);

      setAlunos(alunos.filter((aluno) => aluno.id !== id));
      setConfirmDeleteId(null);
      toast.success('Aluno deletado com sucesso!');

    } catch (err) {
      const errors = get(err, 'response.data.errors', []);
      errors.forEach((error) => toast.error(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Alunos</h1>

      <AlunoContainer>
        {alunos.map((aluno) => (
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, 'fotos[0].url', false) ? (
                <img src={aluno.fotos[0].url} alt={`Foto de ${aluno.nome}`} />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>

            <Link to={`/aluno/${aluno.id}`}>
              <FaEdit size={16} />
            </Link>

            {confirmDeleteId === aluno.id ? (
              <FaExclamation
                size={16}
                style={{ cursor: 'pointer', color: 'black', marginLeft: 1 }}
                onClick={(e) => handleDelete(e, aluno.id)}
                title="Confirmar exclusão"
              />
            ) : (
              <FaWindowClose
                size={16}
                style={{ cursor: 'pointer', color: '#C3073F', marginLeft: 1 }}
                onClick={(e) => handleDeleteAsk(e, aluno.id)}
                title="Excluir aluno"
              />
            )}
          </div>
        ))}
      </AlunoContainer>
    </Container>
  );
}
