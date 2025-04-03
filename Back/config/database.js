const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oracclum';
        console.log('Tentando conectar ao MongoDB:', mongoURI);
        
        // Limpar conexões anteriores
        if (mongoose.connection.readyState !== 0) {
            console.log('Fechando conexão anterior...');
            await mongoose.connection.close();
        }
        
        // Configurar o Mongoose
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,  
            socketTimeoutMS: 45000
        });
        
        console.log(`MongoDB conectado com sucesso ao banco ${mongoURI.split('/').pop()}`);
        
        // Verificar conexão
        mongoose.connection.on('error', err => {
            console.error('Erro na conexão MongoDB:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });
        
        
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);
            console.log('Coleções disponíveis:', collectionNames);
            
            
            if (!collectionNames.includes('questions')) {
                console.log('Criando coleção questions com documento inicial...');
                const Question = require('../models/Question');
                const initialQuestion = new Question({
                    text: 'Pergunta teste inicial do sistema',
                    answer: 'Esta é uma resposta automática para garantir que a coleção seja criada.'
                });
                await initialQuestion.save();
                console.log('Documento inicial criado com sucesso');
            }
        } catch (collectionError) {
            console.error('Erro ao verificar coleções:', collectionError);
        }
        
    } catch (error) {
        console.error('Erro ao conectar com MongoDB:', error.message);
        console.error('Stack trace:', error.stack);
        
        
        if (error.name === 'MongooseServerSelectionError') {
            console.error('Verifique se o MongoDB está em execução na porta 27017');
        }
    }
};

module.exports = connectDB; 