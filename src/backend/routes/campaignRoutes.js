const express = require('express');
const Campaign = require('../models/Campaign'); 

const router = express.Router();

router.post('/create-campaign', async (req, res) => {
    try {
        console.log('Received campaign registration request:', req.body);

        const { title, description, goal, timeToCompleteGoal, contact, nameBankAccount, bankAccount, category, image } = req.body;

        if (!title || !description || !goal || !timeToCompleteGoal || !contact || !nameBankAccount || !bankAccount || !category ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (goal <= 0) {
            return res.status(400).json({ error: 'Goal must be a positive number' });
        }

        if (timeToCompleteGoal <= 0) {
            return res.status(400).json({ error: 'Time to complete goal must be a positive number' });
        }


        console.log('Creating new campaign...');
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
            image, 
            donators: [],
            shopItems: []
        });

        console.log('Saving campaign...');
        await newCampaign.save();

        console.log('Campaign registered successfully:', newCampaign);
        res.status(201).json(newCampaign); 

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to create campaign: ' + err.message });
    }
});

router.get('/all-campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } 
    catch (err) {
        console.error('Error during fetching campaigns:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/get-campaign/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campanha não encontrada!' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error('Erro ao buscar campanha por ID:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

router.post('/donate/:id', async (req, res) => {
    const { id } = req.params;
    const { donation } = req.body;

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        campaign.donators.push(donation);
        campaign.currentAmount += donation[1];

        await campaign.save();
        res.json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/update-shop-items', async (req, res) => {
    const { campaignId, shopItems } = req.body;

    try {
        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { shopItems: shopItems },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ message: "Campanha não encontrada." });
        }

        res.status(200).json({ message: "Itens atualizados com sucesso!", campaign });
    } catch (error) {
        console.error("Erro ao atualizar itens da loja:", error);
        res.status(500).json({ message: "Erro no servidor." });
    }
});



module.exports = router;
