import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { questionService } from '../utils/api';
import '../styles/Questions.css';

const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  
  useEffect(() => {
    // Verificar se o usuário é admin
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    
    if (!token || userType !== 'admin') {
      navigate('/login');
      return;
    }
    
    // Carregar as perguntas
    loadQuestions();
  }, [navigate]);
  
  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("[Admin] Iniciando carregamento de perguntas...");
      const data = await questionService.getQuestions();
      console.log("[Admin] Perguntas carregadas para Admin:", data);
      console.log("[Admin] Número total de perguntas:", data.length);
      console.log("[Admin] Perguntas não respondidas:", data.filter(q => !q.answer && !q.answered).length);
      console.log("[Admin] Perguntas respondidas:", data.filter(q => q.answer || q.answered).length);
      
      // Verificar a estrutura dos dados recebidos e normalizá-los
      const normalizedQuestions = data.map(question => {
        return {
          _id: question._id || question.id,
          text: question.text || "Sem texto",
          answer: question.answer || "",
          // Alguns dados do MongoDB podem usar "isAnswered" em vez de "answered"
          answered: question.answered || question.isAnswered || !!question.answer,
          createdAt: question.createdAt || new Date().toISOString()
        };
      });
      
      setQuestions(normalizedQuestions);
      console.log("[Admin] Perguntas normalizadas:", normalizedQuestions);
      console.log("[Admin] Após normalização - Perguntas não respondidas:", 
        normalizedQuestions.filter(q => !q.answer && !q.answered).length);
      console.log("[Admin] Após normalização - Perguntas respondidas:", 
        normalizedQuestions.filter(q => q.answer || q.answered).length);
      
      // Definir mensagem informativa para modo de demonstração
      setInfoMessage('Visualizando dados de demonstração. As perguntas são armazenadas localmente ou no MongoDB quando disponível.');
    } catch (err) {
      console.error('[Admin] Erro ao carregar perguntas:', err);
      setError(`Erro ao carregar perguntas: ${err.message}. Usando dados locais.`);
      
      // Tentar recuperar perguntas do localStorage diretamente
      try {
        const localData = localStorage.getItem('oracclum_questions');
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log("[Admin] Recuperadas do localStorage após erro:", parsedData);
          setQuestions(parsedData);
          setInfoMessage('Recuperado do armazenamento local após erro.');
        }
      } catch (localError) {
        console.error('[Admin] Erro ao carregar do localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitAnswer = async (questionId, answerText) => {
    if (!answerText || !answerText.trim()) {
      alert('Por favor, digite uma resposta.');
      return;
    }
    
    try {
      const updatedQuestion = await questionService.answerQuestion(questionId, answerText);
      console.log('Pergunta respondida:', updatedQuestion);
      
      alert('Resposta enviada com sucesso!');
      
      // Atualizar a pergunta na lista local
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          (q._id === questionId || q.id === questionId) 
            ? { ...q, answer: answerText, answered: true } 
            : q
        )
      );
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta: ' + error.message);
      
      // Se houver erro, tenta atualizar localmente
      try {
        const questions = JSON.parse(localStorage.getItem('oracclum_questions') || '[]');
        const questionIndex = questions.findIndex(q => q._id === questionId || q.id === questionId);
        
        if (questionIndex !== -1) {
          questions[questionIndex].answer = answerText;
          questions[questionIndex].answered = true;
          localStorage.setItem('oracclum_questions', JSON.stringify(questions));
          
          // Atualizar a UI
          setQuestions(prevQuestions => 
            prevQuestions.map(q => 
              (q._id === questionId || q.id === questionId) 
                ? { ...q, answer: answerText, answered: true } 
                : q
            )
          );
          
          alert('Resposta salva localmente com sucesso!');
        }
      } catch (localError) {
        console.error('Erro ao salvar localmente:', localError);
      }
    }
  };
  
  // Aplicar apenas o filtro de busca, sem filtrar por status de resposta
  const filteredQuestions = questions.filter(question => 
    searchTerm === '' || 
    question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (question.answer && question.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Função auxiliar para verificar se uma pergunta está respondida
  const isAnswered = (question) => {
    return (
      (question.answer && question.answer.trim() !== '') || 
      (question.answered === true)
    );
  };
  
  // Ordenar para mostrar perguntas não respondidas primeiro
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    // Perguntas não respondidas primeiro
    const aAnswered = isAnswered(a);
    const bAnswered = isAnswered(b);
    
    if (!aAnswered && bAnswered) return -1;
    if (aAnswered && !bAnswered) return 1;
    
    // Depois ordenar por data mais recente
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  console.log("Total de perguntas (admin):", questions.length);
  console.log("Perguntas filtradas (admin):", filteredQuestions.length);
  
  return (
    <div className="questions-page">
      <Navbar />
      
      <section className="questions-section">
        <div className="section-header">
          <span className="cs-topper">Administração</span>
          <h1 className="cs-title">Perguntas dos Usuários ({questions.length})</h1>
          {infoMessage && <p className="info-message">{infoMessage}</p>}
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            id="search-input" 
            className="search-input" 
            placeholder="Digite para filtrar perguntas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div id="questions-container">
          {isLoading ? (
            <p className="loading-message">Carregando perguntas...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredQuestions.length === 0 ? (
            <p className="no-questions-message">
              {searchTerm 
                ? 'Nenhuma pergunta encontrada com o termo pesquisado.' 
                : 'Nenhuma pergunta disponível no momento.'}
            </p>
          ) : (
            <>
              <div className="questions-summary">
                <p className="pending-questions">
                  {sortedQuestions.filter(q => !isAnswered(q)).length} perguntas pendentes
                </p>
                <p className="answered-questions">
                  {sortedQuestions.filter(q => isAnswered(q)).length} perguntas respondidas
                </p>
              </div>
              
              {sortedQuestions.map(question => (
                <div 
                  className={`question-card ${!isAnswered(question) ? 'unanswered' : ''}`} 
                  key={question._id || question.id}
                >
                  <p className="question-text">{question.text}</p>
                  <p className="question-date">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                  {isAnswered(question) ? (
                    <div className="answer-section">
                      <p className="answer-text">{question.answer}</p>
                    </div>
                  ) : (
                    <div className="answer-section">
                      <textarea 
                        className="answer-textarea" 
                        placeholder="Digite sua resposta aqui..."
                        onChange={(e) => question.tempAnswer = e.target.value}
                      />
                      <button 
                        className="answer-button" 
                        onClick={() => submitAnswer(question._id || question.id, question.tempAnswer)}
                      >
                        Responder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Questions; 