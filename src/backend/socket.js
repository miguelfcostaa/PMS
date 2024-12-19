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

/**
 * Emite um evento userWon para todos os clientes. 
 * Isso deverá ser chamado quando o utilizador ganhar na ronda.
 * @param {string} userName - Nome do utilizador que ganhou.
 * @param {number} amount - Quantidade de moedas ganhas.
 */
const emitUserWon = (userName, amount) => {
    getIO().emit('userWon', { userName, amount });
};

module.exports = { initIO, getIO, emitUserWon };
