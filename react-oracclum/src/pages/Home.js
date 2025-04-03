import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { questionService } from '../utils/api';
import '../styles/Home.css';

const Home = () => {
  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      setIsAuthenticated(true);
      setUsername(userType === 'admin' ? 'Administrador' : 'Usuário');
      if (userType === 'admin') {
        setIsAdmin(true);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      setErrorMessage('Por favor, digite uma pergunta.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    if (!isAuthenticated) {
      setErrorMessage('Você precisa estar logado para enviar uma pergunta.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    try {
      await questionService.createQuestion(questionText);
      setSuccessMessage('Sua pergunta foi enviada com sucesso! Um administrador irá respondê-la em breve.');
      setQuestionText('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Erro ao enviar pergunta:', error);
      setErrorMessage('Ocorreu um erro ao enviar sua pergunta. Por favor, tente novamente.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <div className="home-container">
      <div className="header-section">
        <h1 className="home-title">Bem-vindo ao Oracclum, {username}!</h1>
        <p className="home-subtitle">Seu portal para tirar dúvidas sobre The Legend of Zelda</p>
        
        <div className="notification-bar">
          <div className="mongodb-info">
            <strong>Conectando-se ao Backend...</strong>
            <p>Perguntas enviadas serão salvas no banco de dados MongoDB através do servidor backend. Se estiver com problemas de conexão, verifique se o servidor backend está rodando na porta 5000.</p>
            <p>Use as seguintes informações para fins de depuração:</p>
            <ul>
              <li>URL da API: <code>http://localhost:5000/api/questions</code></li>
              <li>Método para criar perguntas: <code>POST</code></li>
              <li>Método para obter perguntas: <code>GET</code></li>
              <li>Método para responder: <code>PUT /api/questions/:id/answer</code></li>
            </ul>
          </div>
        </div>
      </div>

      <main className="main-content">
        <section className="info-section">
          <div className="image-container">
            <img src="/images/n64.png" alt="Nintendo 64 com Ocarina of Time" className="zelda-image" />
          </div>
          <div className="text-container">
            <h2>Minhas Histórias Pessoais com Zelda</h2>
            <p>
              Desde que joguei Ocarina of Time no Nintendo 64, me apaixonei pela série The Legend of Zelda. 
              A mistura perfeita de exploração, resolução de quebra-cabeças e aventura criou algumas das minhas 
              memórias mais queridas nos videogames.
            </p>
            <p>
              Os momentos inesquecíveis são inúmeros: a primeira vez que puxei a Master Sword, 
              a emoção de derrotar Ganon após uma longa jornada, ou a descoberta das dezenas de 
              segredos espalhados por Hyrule.
            </p>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <img src="/images/twilight.png" alt="Twilight Princess" className="feature-image" />
            <h3>O Mundo de Twilight Princess</h3>
            <p>
              A dualidade entre o Reino da Luz e o Reino do Crepúsculo trouxe uma profundidade narrativa impressionante, 
              com uma Hyrule mais sombria e madura.
            </p>
          </div>
          <div className="feature-card">
            <img src="/images/zelda.png" alt="Ocarina of Time" className="feature-image" />
            <h3>A Revolução de Ocarina of Time</h3>
            <p>
              O jogo que definiu aventuras 3D mudou para sempre os jogos de ação e aventura, 
              com seu sistema de mira, combate intuitivo e mundo aberto.
            </p>
          </div>
        </section>

        <section className="question-section">
          <h2>Envie sua Pergunta</h2>
          <p>Dúvidas sobre a série The Legend of Zelda? Estamos aqui para ajudar!</p>
          
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <form onSubmit={handleSubmitQuestion} className="question-form">
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Digite sua pergunta sobre The Legend of Zelda..."
              className="question-input"
              rows="4"
            ></textarea>
            <button type="submit" className="submit-button">
              Enviar Pergunta
            </button>
          </form>
          
          <div className="link-container">
            <a href="#" onClick={() => navigate('/seequestions')} className="questions-link">
              Ver perguntas respondidas
            </a>
            {localStorage.getItem('userType') === 'admin' && (
              <a href="#" onClick={() => navigate('/questions')} className="questions-link admin-link">
                Administrar perguntas
              </a>
            )}
          </div>
        </section>
      </main>

      <button onClick={handleLogout} className="corner-logout">
        Logout
      </button>
    </div>
  );
};

export default Home; 