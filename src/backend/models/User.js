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
    role: { 
        type: String, 
        enum: ['doador', 'criador/doador', 'admin'], 
        default: 'doador'
    },
    documents: [documentSchema],
    notificationSeen: { type: Boolean, default: false }, // Novo campo para rastrear a notificação
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
