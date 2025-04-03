const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Rota para salvar uma nova pergunta
router.post('/', async (req, res) => {
    try {
        console.log('Recebendo nova pergunta:', req.body);
        
        if (!req.body) {
            console.log('Erro: Body vazio');
            return res.status(400).json({ success: false, error: 'Requisição sem corpo' });
        }
        
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            console.log('Erro: Texto da pergunta vazio');
            return res.status(400).json({ success: false, error: 'O texto da pergunta é obrigatório' });
        }

        console.log('Criando objeto da pergunta');
        const question = new Question({
            text: text.trim(),
            createdAt: new Date()
        });

        console.log('Salvando pergunta:', question);
        let savedQuestion;
        try {
            savedQuestion = await question.save();
            console.log('Pergunta salva com sucesso:', savedQuestion);
        } catch (saveError) {
            console.error('Erro ao salvar no MongoDB:', saveError);
            return res.status(500).json({ 
                success: false, 
                error: 'Erro ao salvar no banco de dados', 
                details: saveError.message 
            });
        }
        
        console.log('Enviando resposta de sucesso');
        res.status(201).json({
            success: true,
            data: savedQuestion
        });
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
});

// Rota para listar todas as perguntas
router.get('/', async (req, res) => {
    try {
        console.log('Buscando todas as perguntas');
        
        let questions;
        try {
            questions = await Question.find()
                .sort({ createdAt: -1 })
                .lean();
        } catch (findError) {
            console.error('Erro ao buscar do MongoDB:', findError);
            return res.status(500).json({ 
                success: false, 
                error: 'Erro ao buscar no banco de dados', 
                details: findError.message 
            });
        }
            
        console.log(`Encontradas ${questions.length} perguntas`);
        
        res.status(200).json(questions);
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
});

router.post('/:id/answer', async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        
        console.log(`Respondendo pergunta ${id}:`, answer);

        if (!answer || answer.trim() === '') {
            console.log('Erro: Resposta vazia');
            return res.status(400).json({ success: false, error: 'A resposta é obrigatória' });
        }

        let question;
        try {
            question = await Question.findById(id);
        } catch (findError) {
            console.error('Erro ao buscar pergunta:', findError);
            return res.status(500).json({ 
                success: false, 
                error: 'Erro ao buscar pergunta no banco de dados', 
                details: findError.message 
            });
        }
        
        if (!question) {
            console.log('Erro: Pergunta não encontrada');
            return res.status(404).json({ success: false, error: 'Pergunta não encontrada' });
        }

        question.answer = answer.trim();
        question.answeredAt = new Date();
        
        console.log('Atualizando pergunta:', question);
        
        let updatedQuestion;
        try {
            updatedQuestion = await question.save();
            console.log('Resposta salva com sucesso:', updatedQuestion);
        } catch (saveError) {
            console.error('Erro ao salvar resposta:', saveError);
            return res.status(500).json({ 
                success: false, 
                error: 'Erro ao salvar resposta', 
                details: saveError.message 
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedQuestion
        });
    } catch (error) {
        console.error('Erro ao responder pergunta:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
});

module.exports = router; 