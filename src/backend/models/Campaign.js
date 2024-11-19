const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true } // Será uma string Base64
});


const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    timeToCompleteGoal: { type: Number, required: true },
    contact: { type: String, required: true },
    nameBankAccount: { type: String, required: true },
    bankAccount: { type: String, required: true },
    category: { type: String, required: true },
    currentAmount: { type: Number, default: 0 },
    image: { type: Buffer, required: false }, 
    contentType: { type: String, required: false }, 
    donators: { type: Array, default: [] },
    shopItems: { type: Array, default: [] },
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
