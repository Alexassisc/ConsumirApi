import React from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaUserAlt,
  FaCircle,
  FaPowerOff,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';
import { Nav } from './styled';

export default function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const emailModified = useSelector((state) => state.auth.emailModified);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.logout());
    history.push('/');
  };

  return (
    <Nav>
      <Link to="/">
        <FaHome size={24} />
      </Link>

      <Link to="/register">
        <FaUserAlt size={24} />
      </Link>

      {isAuthenticated ? (
        <Link to="/" onClick={handleLogout}>
          <FaPowerOff size={24} />
        </Link>
      ) : (
        <Link to="/login">
          <FaSignInAlt size={24} />
        </Link>
      )}

      {/* O FaCircle pode continuar escondido se email estiver modificado */}
      {isAuthenticated && !emailModified && <FaCircle size={24} color="#66ff33" />}
    </Nav>
  );
}
