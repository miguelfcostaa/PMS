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
    IBAN: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    profilePicture: { type: String, default: '' }, // Novo campo para armazenar a imagem de perfil em Base64
    coins: [
        {
            coinName: { type: String, required: true },
            coinImage: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true } // Associando à campanha
        }
    ],
    role: { 
        type: String, 
        enum: ['doador', 'criador/doador', 'admin'], 
        default: 'doador'
    },
    documents: [documentSchema],
    notificationSeen: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
