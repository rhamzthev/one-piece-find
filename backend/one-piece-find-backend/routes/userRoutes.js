const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users/register
// @desc    Register or create a new user (simple version)
router.post('/register', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        // Check if user already exists
        let user = await User.findOne({ username });
        if (!user) {
            user = await User.create({ username });
        }
        return res.status(200).json({ message: 'User registered', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/users/updateSteps
// @desc    Update user's step count
router.post('/updateSteps', async (req, res) => {
    try {
        const { username, steps } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // For hackathon, let's just add steps to totalSteps
        user.totalSteps += steps;
        await user.save();

        return res.status(200).json({ message: 'Steps updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
