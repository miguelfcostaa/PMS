const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true } // Será uma string Base64
});

const campaignSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
    goal: { type: Number, required: true }, 
    timeToCompleteGoal: { type: Number, required: true },
    currentAmount: { type: Number, required: true },
    donaters: { type: Array, required: true },
    image: [documentSchema],
    contact: { type: String, required: true },
    bankAccount: { type: Number, required: true },
    donationComment : { type: String, required: false },
    category: { type: String, required: true },
    shopItems: { type: Array, required: true },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
