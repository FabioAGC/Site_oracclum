# Oracclum - Portal de Conhecimento sobre The Legend of Zelda

Oracclum é um portal web interativo dedicado à série The Legend of Zelda, permitindo que fãs façam perguntas sobre o universo do jogo e visualizem respostas criadas por administradores. O projeto foi desenvolvido com React.js no frontend e Node.js/Express no backend, com MongoDB para persistência de dados.

## Visão Geral

O projeto possui um tema visual inspirado na franquia The Legend of Zelda e oferece diferentes funcionalidades para usuários comuns e administradores.

### Funcionalidades

- **Sistema de autenticação** com diferentes tipos de usuário (admin e usuário comum)
- **Página inicial** com informações sobre a franquia e imagens temáticas
- **Formulário de perguntas** para usuários enviarem suas dúvidas
- **Visualização de perguntas respondidas** para todos os usuários
- **Painel administrativo** para responder às perguntas dos usuários

## Pré-requisitos

- Node.js (versão 14.0.0 ou superior)
- npm (normalmente instalado com o Node.js)
- MongoDB (necessário para armazenamento das perguntas)

## Como executar o projeto

### Backend (servidor MongoDB e API)

1. Navegue até a pasta do backend:
   ```
   cd Back
   ```

2. Instale as dependências do backend:
   ```
   npm install
   ```

3. Inicie o servidor backend:
   ```
   npm start
   ```
   O servidor backend estará rodando na porta 5000: http://localhost:5000

### Frontend (aplicação React)

1. Em outra janela do terminal, navegue até a pasta do frontend:
   ```
   cd react-oracclum
   ```

2. Instale as dependências do frontend:
   ```
   npm install
   ```

3. Inicie o servidor de desenvolvimento React:
   ```
   npm start
   ```

4. Abra seu navegador e acesse: http://localhost:3000

## Acesso ao sistema

O sistema possui contas pré-configuradas para teste:

### Acesso como Administrador:
- **Usuário**: admin
- **Senha**: admin

### Acesso como Usuário Comum:
- **Usuário**: user
- **Senha**: user

## Arquitetura do Projeto

### Frontend (pasta react-oracclum)
- **public/**: Contém arquivos estáticos, incluindo o HTML principal e imagens
- **src/**: Código-fonte da aplicação
  - **components/**: Componentes reutilizáveis React
  - **pages/**: Páginas da aplicação React (Home, Login, Questions, SeeQuestions)
  - **styles/**: Arquivos CSS para estilização
  - **utils/**: Utilitários, incluindo serviços de API e integração com o backend

### Backend (pasta Back)
- **config/**: Configurações do banco de dados
- **models/**: Modelos de dados MongoDB
- **routes/**: Rotas da API
- **server.js**: Ponto de entrada do servidor

## Armazenamento de Dados

O projeto utiliza MongoDB como principal mecanismo de armazenamento:

1. **MongoDB**:
   - Armazena perguntas e respostas em um banco de dados
   - O servidor backend se conecta ao MongoDB local na porta 27017
   - Endpoints da API:
     - GET `http://localhost:5000/api/questions`: Obter todas as perguntas
     - POST `http://localhost:5000/api/questions`: Criar nova pergunta
     - PUT `http://localhost:5000/api/questions/:id/answer`: Responder a uma pergunta

2. **LocalStorage (Fallback)**:
   - Usado apenas quando o backend não está disponível
   - Persistência limitada ao navegador do usuário

## Tecnologias Utilizadas

- **Frontend**:
  - React.js
  - React Router para navegação
  - CSS para estilização
  - Fetch API para comunicação com o backend

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB para armazenamento de dados
  - Mongoose para modelagem de dados
  - API RESTful para gerenciamento de perguntas e respostas

---

Projeto desenvolvido como demonstração de habilidades em desenvolvimento web full-stack.


