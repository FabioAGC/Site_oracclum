// URL da API (backend Node.js + Express rodando na porta 5000)
const API_URL = 'http://localhost:5000/api';

// Função auxiliar para obter o token de autenticação
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Limpar perguntas antigas do localStorage
const clearHardcodedQuestions = () => {
  localStorage.removeItem('oracclum_questions');
  localStorage.removeItem('oracclum_questions_initialized');
  console.log('Perguntas antigas removidas do localStorage');
};

// Executar limpeza imediatamente
clearHardcodedQuestions();

// Serviço de autenticação
export const authService = {
  // Login do usuário
  login: async (username, password) => {
    try {
      // Verificar credenciais hardcoded
      if (username === 'admin' && password === 'admin') {
        return {
          token: 'admin-token',
          userType: 'admin'
        };
      } else if (username === 'user' && password === 'user') {
        return {
          token: 'user-token',
          userType: 'user'
        };
      } else {
        throw new Error('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  // Logout do usuário
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
  }
};

// Funções auxiliares para o localStorage
const getLocalQuestions = () => {
  const questions = localStorage.getItem('oracclum_questions');
  return questions ? JSON.parse(questions) : [];
};

const saveLocalQuestions = (questions) => {
  localStorage.setItem('oracclum_questions', JSON.stringify(questions));
};

// Verificar conectividade com o MongoDB
const checkMongoDBConnection = async () => {
  try {
    console.log('Verificando conexão com o backend...');
    const response = await fetch(`${API_URL}/test`, { method: 'GET' });
    if (response.ok) {
      console.log('✅ Conexão com o backend estabelecida!');
      return true;
    } else {
      console.error('❌ Backend respondeu, mas com erro:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Falha ao conectar com o backend:', error.message);
    return false;
  }
};

// Tenta verificar a conexão imediatamente
checkMongoDBConnection().then(isConnected => {
  console.log('Status da conexão com o backend:', isConnected ? 'Conectado' : 'Desconectado');
});

// Serviço de perguntas
export const questionService = {
  // Obter todas as perguntas
  getQuestions: async () => {
    try {
      // Tentar obter as perguntas do MongoDB
      try {
        console.log('Tentando buscar perguntas do backend...');
        const response = await fetch(`${API_URL}/questions`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Perguntas carregadas do backend:', data);
          return data;
        } else {
          console.warn(`❌ Backend respondeu com status ${response.status}: ${await response.text()}`);
        }
      } catch (mongoError) {
        console.error('❌ Erro ao conectar com o backend:', mongoError);
      }
      
      // Fallback para localStorage se backend falhar
      console.log('⚠️ Usando perguntas do localStorage como fallback');
      const questions = getLocalQuestions();
      return questions;
    } catch (error) {
      console.error('Erro ao obter perguntas:', error);
      throw error;
    }
  },
  
  // Criar uma nova pergunta
  createQuestion: async (text) => {
    try {
      // Tentar criar a pergunta no backend
      try {
        console.log('Tentando criar pergunta no backend...');
        const response = await fetch(`${API_URL}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ text })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Pergunta criada no backend:', data);
          return data;
        } else {
          console.warn(`❌ Backend respondeu com status ${response.status}: ${await response.text()}`);
        }
      } catch (backendError) {
        console.error('❌ Erro ao conectar com o backend:', backendError);
      }
      
      // Fallback para localStorage se backend falhar
      console.log('⚠️ Salvando pergunta no localStorage como fallback');
      const newQuestion = { 
        _id: Date.now().toString(),
        text: text,
        createdAt: new Date().toISOString(),
        answered: false
      };
      
      // Obter perguntas existentes e adicionar a nova
      const questions = getLocalQuestions();
      questions.push(newQuestion);
      
      // Salvar no localStorage
      saveLocalQuestions(questions);
      console.log('Pergunta salva localmente:', newQuestion);
      
      return newQuestion;
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      throw error;
    }
  },
  
  // Responder a uma pergunta (admin)
  answerQuestion: async (questionId, answer) => {
    try {
      // Tentar responder a pergunta no backend
      try {
        console.log('Tentando responder pergunta no backend...');
        const response = await fetch(`${API_URL}/questions/${questionId}/answer`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ answer })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Pergunta respondida no backend:', data);
          return data;
        } else {
          console.warn(`❌ Backend respondeu com status ${response.status}: ${await response.text()}`);
        }
      } catch (backendError) {
        console.error('❌ Erro ao conectar com o backend:', backendError);
      }
      
      // Fallback para localStorage se backend falhar
      console.log('⚠️ Salvando resposta no localStorage como fallback');
      const questions = getLocalQuestions();
      const questionIndex = questions.findIndex(q => q._id === questionId);
      
      if (questionIndex === -1) {
        throw new Error('Pergunta não encontrada');
      }
      
      // Atualizar a pergunta com a resposta
      questions[questionIndex].answer = answer;
      questions[questionIndex].answered = true;
      
      // Salvar no localStorage
      saveLocalQuestions(questions);
      console.log('Pergunta respondida localmente:', questions[questionIndex]);
      
      return questions[questionIndex];
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      throw error;
    }
  }
};

// Exportando os serviços como um objeto nomeado
export const apiService = {
  auth: authService,
  questions: questionService
};

// Exportando o objeto como default também para manter compatibilidade
export default apiService; 