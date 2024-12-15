const express = require('express');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

const router = express.Router();

router.post('/create-campaign', async (req, res) => {
    try {
        console.log('Received campaign registration request:', req.body);

        const { title, description, goal, timeToCompleteGoal, contact, nameBankAccount, bankAccount, category, image, shopItems, coin } = req.body;

        if (!title || !description || !goal || !timeToCompleteGoal || !contact || !nameBankAccount || !bankAccount || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (goal <= 0) {
            return res.status(400).json({ error: 'Goal must be a positive number' });
        }

        if (timeToCompleteGoal <= 0) {
            return res.status(400).json({ error: 'Time to complete goal must be a positive number' });
        }

        const userId = req.body.creator; 

        if (!userId) {
            return res.status(400).json({ error: 'Creator ID is required' });
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
            image,
            donators: [],
            shopItems,
            creator: userId,
            coin,
            challengeId,
        });

        await newCampaign.save();

        if (challengeId) {
            const challengeToUpdate = user.challenges.find(
                (challenge) => challenge._id.toString() === challengeId
            );

            if (challengeToUpdate) {
                // Atualiza o progresso e marca o desafio como completo
                challengeToUpdate.progress = 100;
                challengeToUpdate.completed = true;
                await user.save();
            }
        }

        console.log('Campaign registered successfully:', newCampaign);
        res.status(201).json(newCampaign);

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to create campaign: ' + err.message });
    }
});


router.get('/all-campaigns', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const campaigns = await Campaign.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .select('title description goal currentAmount category creator');

        res.json(campaigns);
    } 
    catch (err) {
        console.error('Error during fetching campaigns:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/get-campaign/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .select('title description goal currentAmount category contact nameBankAccount bankAccount creator coin shopItems');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found!' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error('Error fetching campaign by ID:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/donate/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, donationDetails } = req.body;

    try {
        const campaign = await Campaign.findById(id).select('donators currentAmount coin');
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        const donationAmount = donationDetails[1];

        // Atualização eficiente utilizando $push e $inc
        await Campaign.updateOne(
            { _id: id },
            {
                $push: { donators: { userId, donationDetails } },
                $inc: { currentAmount: donationAmount },
            }
        );

        const user = await User.findById(userId).select('coins');
        if (!user) return res.status(404).json({ message: "User not found" });

        const coinAmount = Math.floor(donationDetails[1] * 0.55);
        
        const existingCoin = user.coins.find(coin => coin.coinName === campaign.coin[0]);

        if (existingCoin) {
            existingCoin.amount += coinAmount;
        } else {
            user.coins.push({
                coinName: campaign.coin[0],
                coinImage: campaign.coin[1],
                amount: coinAmount,
                campaignId: campaign._id,
            });
        }

        await user.save();
        
        res.json(campaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
