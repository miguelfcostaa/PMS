const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyUser = require('../verificationJob'); // Função de verificação
const mongoose = require('mongoose');


const router = express.Router();

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

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`Received request to fetch user with ID: ${userId}`);

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error(`Invalid user ID format: ${userId}`);
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error(`User not found for ID: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User found: ${user}`);
        res.json(user);
    } catch (error) {
        console.error(`Error fetching user data for ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

module.exports = router;

