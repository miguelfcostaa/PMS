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
    image: { type: String, default: '' }, // ✅ Adiciona o campo "image" no esquema
    donators: {
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            donationDetails: { type: Array, default: [] },
        }],
        default: []
    },
    shopItems: {
        type: [{
            itemName: { type: String, required: true },
            itemPrice: { type: Number, required: true },
            itemImage: { type: String, required: true },
        }],
        default: []
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coin: {
        type: {
            name: { type: String, required: true },
            image: { type: String, required: true },
        },
        required: true
    },
}, { timestamps: true });

campaignSchema.index({ creator: 1 });
campaignSchema.index({ title: 1 });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
