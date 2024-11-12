// src/backend/models/User.js

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true } // Será uma string Base64
});

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    TIN: { type: String },
    passportNumber: { type: String, required: true },
    documents: [documentSchema], // Utilizamos o schema do documento criado acima
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
