import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { questionService } from '../utils/api';
import '../styles/SeeQuestions.css';

function SeeQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionInfo, setConnectionInfo] = useState('Tentando conectar ao MongoDB...');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setConnectionInfo(`Tentando conectar ao MongoDB (tentativa ${retryCount + 1})...`);
        console.log('Buscando perguntas do MongoDB...');
        
        const data = await questionService.getQuestions();
        console.log('Dados recebidos:', data);
        
        if (!data || data.length === 0) {
          console.log('Nenhuma pergunta retornada');
          setConnectionInfo('Conectado, mas nenhuma pergunta encontrada.');
        } else {
          console.log(`${data.length} perguntas recebidas`);
          setConnectionInfo(`Conectado. ${data.length} perguntas carregadas.`);
        }
        
        setQuestions(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar perguntas:', err);
        setError(`Não foi possível carregar as perguntas: ${err.message}`);
        setConnectionInfo(`Falha na conexão: ${err.message}`);
        setLoading(false);
        
        // Tentar novamente após 5 segundos (máximo 3 tentativas)
        if (retryCount < 2) {
          console.log(`Tentando novamente em 5 segundos (tentativa ${retryCount + 1}/3)...`);
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
            setLoading(true);
            setError(null);
          }, 5000);
        }
      }
    }

    fetchQuestions();
  }, [retryCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleManualRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prevCount => prevCount + 1);
  };

  // Normalização dos dados das perguntas
  const normalizedQuestions = questions.map(q => ({
    id: q._id || q.id,
    text: q.text,
    date: q.createdAt || q.date,
    answered: q.answered || !!q.answer,
    answer: q.answer
  }));

  // Filtrando apenas perguntas respondidas
  let answeredQuestions = normalizedQuestions.filter(q => q.answered);

  // Filtrando por termo de busca (se existir)
  const filteredQuestions = searchTerm
    ? answeredQuestions.filter(q => 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (q.answer && q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : answeredQuestions;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      };
      return date.toLocaleDateString('pt-BR', options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="see-questions-page">
        <div className="questions-section">
          <h1 className="section-header">Perguntas Respondidas</h1>
          <div className="loading-message">Carregando perguntas...</div>
          <div className="connection-info">{connectionInfo}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="see-questions-page">
        <div className="questions-section">
          <h1 className="section-header">Perguntas Respondidas</h1>
          <div className="error-message">{error}</div>
          <div className="connection-info">{connectionInfo}</div>
          <button onClick={handleManualRetry} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="see-questions-page">
      <div className="questions-section">
        {/* Navigation Bar */}
        <div className="nav-container">
          <Link to="/" className="nav-button">
            Voltar para Home
          </Link>
          <button onClick={handleLogout} className="nav-button logout-button">
            Logout
          </button>
        </div>

        <div className="cs-container">
          <div className="cs-content">
            <span className="cs-topper">Oracclum</span>
            <h2 className="cs-title">Perguntas Respondidas</h2>
            <p className="cs-text">
              Abaixo estão as perguntas que já foram respondidas pela nossa equipe.
            </p>
            <div className="connection-status">{connectionInfo}</div>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar perguntas ou respostas..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="no-questions-container">
            <div className="no-questions-message">
              {searchTerm 
                ? `Nenhuma pergunta encontrada para "${searchTerm}".` 
                : "Ainda não há perguntas respondidas."}
            </div>
            {searchTerm ? (
              <div className="hint-message">
                Tente termos diferentes ou limpe a busca para ver todas as perguntas respondidas.
              </div>
            ) : (
              <div className="hint-message">
                <button onClick={handleManualRetry} className="retry-button-small">
                  Verificar novamente
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="question-count">{filteredQuestions.length} pergunta{filteredQuestions.length !== 1 ? 's' : ''} respondida{filteredQuestions.length !== 1 ? 's' : ''}</p>
            
            {filteredQuestions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-text">{question.text}</div>
                <div className="question-date">Perguntado em {formatDate(question.date)}</div>
                <div className="answer-section">
                  <div className="answer-text">{question.answer}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SeeQuestions;