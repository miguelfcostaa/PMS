const express = require('express');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

const router = express.Router();

// Criar nova campanha
router.post('/create-campaign', async (req, res) => {
    try {
        console.log('Received campaign registration request:', req.body);

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

        // Verifica se todos os campos obrigatórios estão presentes
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

        // Criar a campanha
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

        // Tentar atualizar desafios do utilizador
        const user = await User.findById(creator).select('challenges');
        if (user) {
            user.challenges.push({
                name: 'Criar uma campanha',
                description: `Desafio de criar a campanha "${title}"`,
                progress: 100,
                completed: true,
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
    const { id } = req.params;
    const { userId, donationDetails } = req.body;

    try {
        const campaign = await Campaign.findById(id).select('donators currentAmount coin');
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        // Verificar se a campanha tem coin definida
        if (!campaign.coin || !campaign.coin.name || !campaign.coin.image) {
            console.error('Campaign coin not defined or malformed.');
            return res.status(500).json({ message: 'Campaign coin not defined. Please ensure the campaign has a coin field.' });
        }

        const donationAmount = donationDetails[1];

        // Atualizar a campanha
        await Campaign.updateOne(
            { _id: id },
            {
                $push: { donators: { userId, donationDetails } },
                $inc: { currentAmount: donationAmount },
            }
        );

        const user = await User.findById(userId).select('coins');
        if (!user) return res.status(404).json({ message: "User not found" });

        const coinAmount = Math.floor(donationAmount * 0.55);

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

        // Retornar a campanha atualizada após a doação
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
