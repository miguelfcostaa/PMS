let io;

const initIO = (server) => {
    if (!io) {
        io = require('socket.io')(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true,
            },
        });

        io.on('connection', (socket) => {
            console.log('Socket.IO client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Socket.IO client disconnected:', socket.id);
            });
        });
    }
    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.io is not initialized.');
    return io;
};

module.exports = { initIO, getIO };
