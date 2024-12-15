const mongoose = require('mongoose');

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
    image: { type: String, required: false },
    contentType: { type: String, required: false },
    donators: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        donationDetails: { type: Array, default: [] },
    }],
    shopItems: { type: Array, default: [] },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coin: { type: [String], required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: false },
}, { timestamps: true });

campaignSchema.index({ creator: 1 });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
