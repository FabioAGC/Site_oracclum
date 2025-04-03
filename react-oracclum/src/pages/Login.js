import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      // Se as credenciais estiverem corretas, fazer login
      if ((username === 'user' && password === 'user') || 
          (username === 'admin' && password === 'admin')) {
        
        // Determinar o tipo de usuário
        const userType = username === 'admin' ? 'admin' : 'user';
        
        // Simular o token
        const token = 'mock-jwt-token-' + Date.now();
        
        // Salvar token e tipo de usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('isAuthenticated', 'true');

        // Redirecionar baseado no tipo de usuário
        navigate('/');
      } else {
        // Credenciais inválidas
        throw new Error('Usuário ou senha incorretos');
      }
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      console.error('Erro de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-elements">
        <div className="decorative-element plant-1"></div>
        <div className="decorative-element plant-2"></div>
        <div className="decorative-element plant-3"></div>
        <div className="decorative-element lines-1"></div>
        <div className="decorative-element lines-2"></div>
        <div className="decorative-element blob-1"></div>
        <div className="decorative-element blob-2"></div>
        <div className="decorative-element mesh-1"></div>
        <div className="decorative-element mesh-2"></div>
      </div>

      <div className={`login-container ${isShaking ? 'shake' : ''}`}>
        <div className="login-header">
          <h1 className="login-title">Oracclum</h1>
          <p className="login-subtitle">Entre para acessar o sistema</p>
        </div>

        <div id="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Usuário</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
            <div id="error-message" className="error-message" style={{display: error ? 'block' : 'none'}}>
              {error}
            </div>
          </div>

          <button 
            id="login-button" 
            className="login-button" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 