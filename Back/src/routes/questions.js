const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Question = require('../models/Question');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all questions (protected route)
router.get('/', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a new question
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const question = new Question({ text });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Answer a question (protected route)
router.put('/:id/answer', verifyToken, async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answer = answer;
    question.answeredAt = new Date();
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 