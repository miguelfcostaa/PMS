const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./db');
const { initIO } = require('./socket');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

// Configurar dotenv para variáveis de ambiente
dotenv.config({ path: './src/backend/.env' });

const app = express();
const server = http.createServer(app);

// Middleware CORS para permitir apenas a origem do frontend
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware para analisar o corpo das requisições
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicialização do Socket.IO
const io = initIO(server); // Retorna a instância única do socket.io

// Middleware global para gerir erros
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

// Captura de exceções não tratadas no processo
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Captura de promessas rejeitadas não tratadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Fecha a conexão do MongoDB ao receber SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    try {
        console.log('SIGINT signal received: closing MongoDB connection');
        const db = await connectDB(); // Reutiliza a conexão compartilhada
        await db.connection.close(); // Fecha a conexão corretamente
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

// Exibir o número de conexões ativas do MongoDB a cada 60 segundos
setInterval(async () => {
    try {
        const db = await connectDB();
        const connections = await db.connection.db.admin().serverStatus();
        console.log('Current connections:', connections.connections.current);
    } catch (error) {
        console.error('Error checking current connections:', error);
    }
}, 60000); // Verificação a cada 60 segundos

// Gerir eventos Socket.IO
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Conectar ao MongoDB e iniciar o servidor
(async () => {
    try {
        await connectDB(); // Usa a conexão singleton
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
})();
