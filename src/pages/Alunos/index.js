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
import { useSelector } from 'react-redux';
import { NovoAluno } from './styled';
import { useLocation } from 'react-router-dom';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated, location.key]);

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

      <NovoAluno to="/aluno">Novo Aluno</NovoAluno>

      <AlunoContainer>
        {alunos.map((aluno) => (
          <div
            key={String(aluno.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Lado esquerdo: Foto + nome + email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ProfilePicture>
                {aluno.fotos && aluno.fotos.length > 0 ? (
                  <img
                    src={`${aluno.fotos[aluno.fotos.length - 1].url}?t=${new Date().getTime()}`}
                    alt={`Foto de ${aluno.nome}`}
                  />
                ) : (
                  <FaUserCircle size={36} />
                )}
              </ProfilePicture>

              {/* Nome + Email na mesma linha */}
              <div>
                <strong>{aluno.nome}</strong>{' '}
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  {aluno.email}
                </span>
              </div>
            </div>

            {/* Lado direito: Botões */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to={`/aluno/${aluno.id}/edit`}>
                <FaEdit size={16} color="#C3073F" title="Editar aluno" />
              </Link>

              {confirmDeleteId === aluno.id ? (
                <FaExclamation
                  size={16}
                  style={{ cursor: 'pointer', color: 'black' }}
                  onClick={(e) => handleDelete(e, aluno.id)}
                  title="Confirmar exclusão"
                />
              ) : (
                <FaWindowClose
                  size={16}
                  style={{ cursor: 'pointer', color: '#C3073F' }}
                  onClick={(e) => handleDeleteAsk(e, aluno.id)}
                  title="Excluir aluno"
                />
              )}
            </div>
          </div>
        ))}
      </AlunoContainer>
    </Container>
  );
}
