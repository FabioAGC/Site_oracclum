const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'O texto da pergunta é obrigatório'],
        trim: true
    },
    answer: {
        type: String,
        default: null,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    answeredAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'questions'
});

QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ answeredAt: -1 });

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question; 