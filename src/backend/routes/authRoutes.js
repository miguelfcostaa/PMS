const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyUser = require('../verificationJob'); 
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();

// Verificação se JWT_SECRET está definido
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Please add it to your .env file');
}

// Configuração do Multer para lidar com uploads de arquivos
const storage = multer.memoryStorage();
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
        if (!hashedPassword) {
            throw new Error('Password hashing failed');
        }

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

    // Verifica se os campos obrigatórios estão presentes
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Procura o utilizador na base de dados
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verifica se a senha é correta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retorna o token e informações do utilizador
        return res.status(200).json({
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
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
            coins: user.coins
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// Rota para atualizar as moedas de um utilizador
router.put('/:userId/coins', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        console.log('Request received to update coins');
        const { coinName, amount } = req.body;

        if (!coinName || amount == null) {
            return res.status(400).json({ message: 'coinName and amount are required' });
        }

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
        console.error('Error updating coins:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
