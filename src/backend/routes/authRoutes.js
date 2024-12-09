const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyUser = require('../verificationJob'); // Função de verificação
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();

// Configuração do Multer para lidar com uploads de arquivos
const storage = multer.memoryStorage(); // Armazenamento na memória para fácil manipulação do Buffer
const upload = multer({ storage: storage });

// Rota de registo
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, TIN, passportNumber, documents } = req.body;

        const userExists = await User.findOne({ email });
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
            documents,
            role: 'doador',
        });

        await newUser.save();

        console.log(`User registered successfully: ${newUser.email}`);

        // Inicia o "countdown" no backend
        setTimeout(() => verifyUser(newUser._id), 60000);

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

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

        res.json({
            token,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter notificações
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.notificationSeen) {
            return res.json({ notifications: [], role: user.role });
        }

        const notifications = [];
        if (user.role === 'criador/doador') {
            notifications.push({
                title: 'Your account was successfully verified',
                message: 'You are now able to create campaigns',
            });

            user.notificationSeen = true;
            await user.save();
        }

        res.json({ notifications, role: user.role });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar informações do utilizador
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Retorna o utilizador atualizado
    } catch (error) {
        console.error('Error updating user:', error);
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
            coins: user.coins // Incluir as moedas do utilizador
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// Rota para atualizar as moedas de um utilizador
router.put('/:userId/coins', async (req, res) => {
    console.log('Request received to update coins');
    console.log('User ID:', req.params.userId);
    console.log('Request body:', req.body);

    const { userId } = req.params;
    const { coinName, amount } = req.body;

    if (!coinName || amount == null) {
        return res.status(400).json({ message: 'coinName and amount are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const coin = user.coins.find(c => c.coinName === coinName);
        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }

        coin.amount += amount;

        await user.save();
        res.status(200).json({ message: 'Coins updated successfully', coins: user.coins });
    } catch (error) {
        console.error('Erro ao atualizar moedas:', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
