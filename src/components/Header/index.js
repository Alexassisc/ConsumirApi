import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';

import { Nav } from './styled';

export default function Header() {
  const clicked = useSelector(state => state.example.clicked);

  return (
    <Nav>
      <Link to="/">
        <FaHome size={24} />
      </Link>

      <Link to="/login">
        <FaUserAlt size={24} />
      </Link>

      <Link to="/asasas">
        <FaSignInAlt size={24} />
      </Link>

      <p>{clicked ? 'Botão foi clicado!' : 'Botão não clicado!'}</p>
    </Nav>
  );
}
