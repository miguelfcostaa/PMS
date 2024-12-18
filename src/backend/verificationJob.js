const User = require('./models/User');
const { getIO } = require('./socket'); // Importar o getIO do ficheiro separado

const verifyUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found`);
            return;
        }

        if (user.role === 'doador') {
            user.role = 'criador/doador';
            user.notificationSeen = false;
            await user.save();

            console.log(`User with ID ${userId} is now verified as 'criador/doador'.`);
            
            // Obtemos a instância de io depois de ter sido inicializada
            const io = getIO();
            io.emit('userVerified', { userId, role: user.role });
        }
    } catch (error) {
        console.error(`Error verifying user: ${error.message}`);
    }
};

module.exports = verifyUser;
