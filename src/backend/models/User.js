const { mongoose } = require('../db');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true }
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
    profilePicture: { type: String, default: '' }, 
    coins: [{
        coinName: { type: String, required: true },
        coinImage: { type: String, required: true },
        amount: { type: Number, required: true, default: 0 },
        campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true }
    }],
    role: { 
        type: String, 
        enum: ['doador', 'criador/doador', 'admin'], 
        default: 'doador'
    },
    challenges: [
        {
            name: { type: String, required: true }, 
            description: { type: String, required: true }, 
            progress: { type: Number, default: 0 }, 
            completed: { type: Boolean, default: false }, 
            associatedCampaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }, 
        },
    ],
    documents: [documentSchema],
    notificationSeen: { type: Boolean, default: false },
    crashEarnings: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
