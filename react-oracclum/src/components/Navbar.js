import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';

const Navbar = ({ showHome = true, showLogout = true }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      {showHome && (
        <Link to="/" className="nav-button">
          Voltar para Home
        </Link>
      )}
      <div>
        {showLogout && (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 