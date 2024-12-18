const { mongoose } = require('../db');

// Definição do esquema de campanha
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
    image: { type: String, default: '' }, // Campo "image" para armazenar a imagem da campanha
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

// Índices para otimizar as buscas
campaignSchema.index({ creator: 1 });
campaignSchema.index({ title: 1 });

// Exportação do modelo reutilizando a conexão mongoose existente
let Campaign;
try {
    Campaign = mongoose.model('Campaign'); // Se o modelo já foi definido, usa a instância existente
} catch (error) {
    Campaign = mongoose.model('Campaign', campaignSchema); // Caso contrário, define o modelo
}

module.exports = Campaign;
