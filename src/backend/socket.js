let io;

const initIO = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true 
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('message', (message) => {
            console.log('Message received from client:', message);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.io is not initialized.');
    return io;
};

module.exports = { initIO, getIO };
