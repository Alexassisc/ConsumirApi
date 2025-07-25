import React, { useEffect, useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import api from '../../services/axios';
import { AlunoContainer, ProfilePicture } from './styled';
import { get } from 'lodash';
import {FaUserCircle, FaEdit, FaWindowClose} from 'react-icons/fa'
import { Link } from 'react-router-dom'



export default function Alunos() {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get('/alunos');
        setAlunos(response.data);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err.response || err);
      }
    }

    getData();
  }, []);

  return (
    <Container>
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

      <Link to={`/aluno/${aluno.id}`}><FaEdit size={16}/></Link>
      <Link to={`/aluno/${aluno.id}/delete`}><FaWindowClose size={16}/></Link>
    </div>
  ))}
</AlunoContainer>
    </Container>
  );
}
