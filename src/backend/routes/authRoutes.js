const express = require('express');
const User = require('../models/User'); // Usa a conexão já estabelecida pelo mongoose no arquivo db.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyUser = require('../verificationJob');
const multer = require('multer');
const { mongoose } = require('../db');

const router = express.Router();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Please add it to your .env file');
}

// Configuração do Multer para lidar com uploads de arquivos (opcional)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota de registo
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, TIN, passportNumber, documents } = req.body;

        const userExists = await User.findOne({ email }).select('_id');
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            TIN,
            passportNumber,
            IBAN: '',
            paymentMethod: '',
            role: 'doador',
            documents,
        });

        await newUser.save();
        console.log(`User registered successfully: ${newUser.email}`);

        setImmediate(() => verifyUser(newUser._id));

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
});


// Rota para upload de imagem de perfil
router.put('/:userId/profile-picture', upload.single('profilePicture'), async (req, res) => {
    const { userId } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const mimeType = req.file.mimetype;
        if (!['image/png', 'image/jpeg'].includes(mimeType)) {
            return res.status(400).json({ message: 'Only images are allowed (png, jpeg)' });
        }

        const profilePictureBase64 = req.file.buffer.toString('base64');
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: profilePictureBase64 },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile picture updated successfully', profilePicture: updatedUser.profilePicture });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Verifica se o utilizador existe e retorna os campos relevantes
        const user = await User.findOne({ email }).select('email password role');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verifica se a palavra-passe está correta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Rota para obter notificações
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId).select('role notificationSeen');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.notificationSeen) {
            return res.json({ notifications: [], role: user.role });
        }

        const notifications = [{
            title: 'Account Verified',
            message: 'Your account has been verified successfully.',
        }];

        await User.updateOne({ _id: userId }, { $set: { notificationSeen: true } });

        res.json({ notifications, role: user.role });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
});



// Rota para obter informações do utilizador
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            ...user.toObject(),
            coins: user.coins
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// Rota para atualizar as moedas de um utilizador
const { getIO } = require('../socket'); // Importa o Socket.IO

router.put('/:userId/coins', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const { coinName, amount } = req.body;

        if (!coinName || amount == null) {
            return res.status(400).json({ message: 'coinName and amount are required' });
        }

        // Atualiza as moedas e crashEarnings
        const result = await User.updateOne(
            { _id: userId, 'coins.coinName': coinName },
            { 
                $inc: { 'coins.$.amount': amount, crashEarnings: amount }, 
                $set: { updatedAt: new Date() }
            }
        );


        if (amount > 0) {
            // Buscar o nome do utilizador
            const updatedUser = await User.findById(userId).select('firstName');

            // Emite o evento userWon, passando o nome do utilizador e as moedas ganhas
            const { emitUserWon } = require('../socket'); 
            emitUserWon(updatedUser.firstName, amount);
            console.log(`Emitted userWon event for user ${updatedUser.firstName} with ${amount} coins`);
        }


        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User or Coin not found' });
        }

        // Emite o evento para notificar todos os clientes que a leaderboard foi atualizada
        const io = getIO();
        io.emit('leaderboardUpdated');

        res.status(200).json({ message: 'Coins and earnings updated successfully' });
    } catch (error) {
        console.error('Error updating coins:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/list-challenges/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('challenges');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

// Rota para atualizar o progresso de um desafio de um usuário
router.put('/challenges/:userId/:challengeId', async (req, res) => {
    const { userId, challengeId } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(challengeId)) {
        return res.status(400).json({ message: 'Invalid user ID or challenge ID' });
    }

    try {
        const userChallenge = await UserChallenge.findOneAndUpdate(
            { userId, challengeId },
            { progress, completed: progress >= 100 }, // Marca como completo se progresso >= 100
            { upsert: true, new: true } // Cria se não existir
        );

        res.status(200).json(userChallenge);
    } catch (error) {
        console.error('Error updating challenge progress:', error);
        res.status(500).json({ error: 'Error updating challenge progress' });
    }
});

// Rota para criar novos desafios (pode ser usada para administração)
router.post('/challenges', async (req, res) => {
    const { description, isMedal, image } = req.body;

    if (!description || !image) {
        return res.status(400).json({ message: 'Description and image are required' });
    }

    try {
        const newChallenge = new Challenge({
            description,
            isMedal: isMedal || false,
            image,
        });

        await newChallenge.save();

        res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ error: 'Error creating challenge' });
    }
});

router.delete('/challenges/:challengeId', async (req, res) => {
    const { challengeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
        return res.status(400).json({ message: 'Invalid challenge ID' });
    }

    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(challengeId);

        if (!deletedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        res.status(200).json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({ error: 'Error deleting challenge' });
    }
});

// **Rota para obter desafios de um utilizador**
router.get('/challenges/:userId', async (req, res) => {
    const { userId } = req.params;

    // Verifica se o userId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Busca o utilizador e seleciona apenas o campo "challenges"
        const user = await User.findById(userId).select('challenges');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error.message);
        res.status(500).json({ error: 'Error fetching challenges' });
    }
});


router.put('/challenges/:userId/:challengeId', async (req, res) => {
    const { userId, challengeId } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(challengeId)) {
        return res.status(400).json({ message: 'Invalid user ID or challenge ID' });
    }

    try {
        const userChallenge = await UserChallenge.findOneAndUpdate(
            { userId, challengeId },
            { progress, completed: progress >= 100 }, // Marca como completo se progresso >= 100
            { upsert: true, new: true } // Cria se não existir
        );

        res.status(200).json(userChallenge);
    } catch (error) {
        console.error('Error updating challenge progress:', error);
        res.status(500).json({ error: 'Error updating challenge progress' });
    }
});

// Rota para atualizar as informações do utilizador
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const updatedData = req.body;

        // Atualiza os dados do utilizador
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Error updating user data' });
    }
});


// Endpoint para buscar a leaderboard dos utilizadores que mais ganharam moedas no Crash
router.get('/leaderboard/crash', async (req, res) => {
    try {
        const topUsers = await User.find({})
            .select('firstName crashEarnings')
            .sort({ crashEarnings: -1 }) // Ordenar pelo total de moedas ganhas no Crash
            .limit(10); // Limitar a 10 utilizadores

        res.status(200).json(topUsers.map((user, index) => ({
            rank: index + 1,
            name: user.firstName,
            coinsWon: user.crashEarnings,
        })));
    } catch (error) {
        console.error("Erro ao buscar leaderboard:", error);
        res.status(500).json({ error: "Erro ao buscar leaderboard" });
    }
});


module.exports = router;