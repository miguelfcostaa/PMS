const express = require('express');
const Campaign = require('../models/Campaign'); // Usa a conexão já estabelecida no db.js
const User = require('../models/User'); // Reutilização do modelo User sem criar novas conexões

const router = express.Router();

// Criar nova campanha
router.post('/create-campaign', async (req, res) => {
    try {
        const {
            title,
            description,
            goal,
            timeToCompleteGoal,
            contact,
            nameBankAccount,
            bankAccount,
            category,
            image,
            shopItems,
            coin,
            creator
        } = req.body;

        if (!title || !description || goal == null || timeToCompleteGoal == null || !contact || !nameBankAccount || !bankAccount || !category || !creator) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (goal <= 0) {
            return res.status(400).json({ error: 'Goal must be a positive number' });
        }

        if (timeToCompleteGoal <= 0) {
            return res.status(400).json({ error: 'Time to complete goal must be a positive number' });
        }

        if (!coin || !coin.name || !coin.image) {
            return res.status(400).json({ error: 'Coin (with name and image) is required' });
        }

        const newCampaign = new Campaign({
            title,
            description,
            goal,
            timeToCompleteGoal,
            contact,
            nameBankAccount,
            bankAccount,
            category,
            currentAmount: 0,
            image: typeof image === 'string' ? image : '',
            donators: [],
            shopItems: Array.isArray(shopItems) ? shopItems : [],
            creator,
            coin,
        });

        await newCampaign.save();

        const user = await User.findById(creator).select('challenges');
        if (user) {
            if (!Array.isArray(user.challenges)) {
                user.challenges = [];
            }

            user.challenges.push({
                name: 'Create a Campaign',
                description: `Desafio de criar a campanha "${title}"`,
                progress: 100,
                completed: true,
                associatedCampaign: newCampaign._id,
            });
            user.challenges.push({
                name: `Make your campaign reach its goal.`,
                description: `Acompanhe o progresso para alcançar a meta de €${goal.toFixed(2)}.`,
                progress: 0,
                completed: false,
                associatedCampaign: newCampaign._id,
            });
            await user.save();
        }
        console.log('Campaign registered successfully:', newCampaign);
        return res.status(201).json(newCampaign);

    } catch (err) {
        console.error('Error during campaign creation:', err);
        return res.status(500).json({ error: 'Failed to create campaign: ' + err.message });
    }
});

// Obter todas as campanhas com paginação
router.get('/all-campaigns', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;

        const campaigns = await Campaign.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .select('title description goal currentAmount category creator timeToCompleteGoal image donators')
            .populate('creator', 'firstName lastName profilePicture');

        res.json(campaigns);
    } catch (err) {
        console.error('Error during fetching campaigns:', err);
        res.status(500).json({ error: err.message });
    }
});

// Obter detalhes de uma campanha por ID
router.get('/get-campaign/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .select('title description goal currentAmount category contact nameBankAccount bankAccount creator coin shopItems timeToCompleteGoal donators image')
            .populate('creator', 'firstName lastName profilePicture');


        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found!' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error('Error fetching campaign by ID:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Fazer doação para uma campanha
router.post('/donate/:id', async (req, res) => {
    const { id } = req.params; // ID da campanha
    const { userId, donationDetails } = req.body; // Dados da doação e do usuário

    try {
        // Buscar a campanha com o creator populado
        const campaign = await Campaign.findById(id)
            .populate('creator', 'challenges title') // Popula o creator e pega os challenges
            .select('donators currentAmount goal coin creator title');

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        if (!campaign.creator) {
            console.warn('Campaign does not have an associated creator:', campaign);
            return res.status(404).json({ message: "Campaign creator not found" });
        }

        const donationAmount = donationDetails[1]; // Valor da doação

        // Atualizar a campanha: adicionar doador e incrementar o valor atual
        await Campaign.updateOne(
            { _id: id },
            {
                $push: { donators: { userId, donationDetails } },
                $inc: { currentAmount: donationAmount },
            }
        );

        // Buscar o usuário que doou
        const user = await User.findById(userId).select('coins donators challenges');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const coinAmount = Math.floor(donationAmount * 0.55);

        // Adicionar ou atualizar a moeda do usuário
        const existingCoin = user.coins.find(c => c.coinName === campaign.coin.name);
        if (existingCoin) {
            existingCoin.amount += coinAmount;
        } else {
            user.coins.push({
                coinName: campaign.coin.name,
                coinImage: campaign.coin.image,
                amount: coinAmount,
                campaignId: campaign._id,
            });
        }
        await user.save();

        const creator = await User.findById(campaign.creator).select('challenges');
        if (!creator) {
            console.error('Creator not found for this campaign.');
            return res.status(404).json({ message: "Creator not found." });
        }

        campaign.currentAmount += donationAmount;
        await campaign.save();

        // Procurar o desafio com o título da campanha
        const challengeIndex = creator.challenges.findIndex(challenge =>
            String(challenge.associatedCampaign) === String(campaign._id) &&
            challenge.name.includes(campaign.title)
        );

        if (challengeIndex !== -1) {
            const progressPercentage = Math.round((campaign.currentAmount / campaign.goal) * 100);

            // Atualizar o progresso do desafio
            creator.challenges[challengeIndex].progress = (Math.min(progressPercentage, 100));
            creator.challenges[challengeIndex].completed = (Math.min(progressPercentage, 100)) === 100;

            // Salvar o progresso atualizado
            await creator.save();
            console.log('Challenge progress updated successfully.');
        } else {
            console.warn('No active challenge found for campaign goal.');
        }

        const donationThreshold = 500;

        const existingDonationChallenge = user.challenges.find(challenge =>
            challenge.name.includes(`Doar €${donationThreshold}`)
        );

        if (!existingDonationChallenge) {
            // Se o desafio não existe, cria um novo
            if (!user.challenges) {
                user.challenges = []; // Inicializa como array vazio se necessário
            }

            user.challenges.push({
                name: `Donate at least 500€ in any campaign`,
                description: `Você atingiu o valor total de €${donationThreshold} em doações.`,
                progress: Math.min((donationAmount / donationThreshold) * 100, 100),
                completed: donationAmount >= donationThreshold,
            });
            console.log('Donation challenge created successfully.');
        } else {
            // Se o desafio já existe, atualiza o progresso
            existingDonationChallenge.progress = Math.min(
                (existingDonationChallenge.progress || 0) + (donationAmount / donationThreshold) * 100,
                100
            );
            existingDonationChallenge.completed =
                (existingDonationChallenge.progress || 0) + (donationAmount / donationThreshold) * 100 >= 100;

            console.log('Donation challenge progress updated.');
        }

        // Salva o usuário atualizado
        await user.save();


        const updatedCampaign = await Campaign.findById(id)
            .select('title description goal currentAmount category contact nameBankAccount bankAccount creator coin shopItems timeToCompleteGoal donators image');

        return res.status(200).json(updatedCampaign);

    } catch (error) {
        console.error('Error processing donation:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Atualizar uma campanha
router.put('/update-campaign/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        goal,
        timeToCompleteGoal,
        contact,
        nameBankAccount,
        bankAccount,
        category,
        image,
        shopItems,
        coin
    } = req.body;

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        // Atualizar os campos da campanha apenas se definidos
        if (title !== undefined) campaign.title = title;
        if (description !== undefined) campaign.description = description;
        if (goal !== undefined) campaign.goal = goal;
        if (timeToCompleteGoal !== undefined) campaign.timeToCompleteGoal = timeToCompleteGoal;
        if (contact !== undefined) campaign.contact = contact;
        if (nameBankAccount !== undefined) campaign.nameBankAccount = nameBankAccount;
        if (bankAccount !== undefined) campaign.bankAccount = bankAccount;
        if (category !== undefined) campaign.category = category;
        if (image !== undefined) campaign.image = typeof image === 'string' ? image : '';
        if (shopItems !== undefined) campaign.shopItems = Array.isArray(shopItems) ? shopItems : [];
        if (coin && coin.name && coin.image) campaign.coin = coin;

        await campaign.save();
        return res.status(200).json(campaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
