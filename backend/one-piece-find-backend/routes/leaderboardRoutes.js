const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/leaderboard/berries
// @desc    Get top users by totalBerries
router.get('/berries', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ totalBerries: -1 }) // descending
            .limit(10);
        res.status(200).json(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/leaderboard/steps
// @desc    Get top users by totalSteps
router.get('/steps', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ totalSteps: -1 }) // descending
            .limit(10);
        res.status(200).json(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
