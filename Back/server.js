const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Teste de conexão
app.get('/api/test', (req, res) => {
    console.log('Teste de conexão recebido');
    res.json({ message: 'Backend está funcionando!' });
});

// Rotas
app.use('/api/questions', require('./routes/questions'));

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados: oracclum`);
    console.log(`URL do MongoDB: mongodb://127.0.0.1:27017/oracclum`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}); 