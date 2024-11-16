const express = require('express');
const Campaign = require('../models/Campaign'); 

const router = express.Router();

router.post('/create-campaign', async (req, res) => {
    try {
        console.log('Received campaign registration request:', req.body);

        const { name, description, goal, timeToCompleteGoal, currentAmount, contact, bankAccount, donationComment, category } = req.body;

        if (!name || !description || !goal || !timeToCompleteGoal || !contact || !bankAccount || !donationComment || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (goal <= 0) {
            return res.status(400).json({ error: 'Goal must be a positive number' });
        }

        console.log('Creating new campaign...');
        const newCampaign = new Campaign({
            name,
            description,
            goal,
            timeToCompleteGoal,
            currentAmount: 0,
            contact,
            bankAccount,
            donationComment,
            category,
            donaters: [],
            image: [],
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

module.exports = router;
