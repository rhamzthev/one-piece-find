const express = require('express');
const router = express.Router();
const Treasure = require('../models/Treasure');
const User = require('../models/User');

// @route   GET /api/treasure/today
// @desc    Get today's main treasure (or big treasure)
router.get('/today', async (req, res) => {
    try {
        // For hackathon, you could just find the most recent big treasure
        let treasure = await Treasure.findOne({ isBigTreasure: true })
            .sort({ date: -1 });
        if (!treasure) {
            // or create a default if none found
            treasure = await Treasure.create({
                lat: 40.7128, // Hardcoded for example
                lng: -74.0060,
                rewardAmount: 1000,
                isBigTreasure: true
            });
        }

        res.status(200).json({ treasure });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/treasure/claim
// @desc    Claim the treasure (check distance, award Berries)
router.post('/claim', async (req, res) => {
    try {
        const { username, userLat, userLng } = req.body;
        if (!username || userLat == null || userLng == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For simplicity, let's just claim today's big treasure
        // In production, you might handle multiple or smaller ones.
        let treasure = await Treasure.findOne({ isBigTreasure: true })
            .sort({ date: -1 });
        if (!treasure) {
            return res.status(404).json({ message: 'No treasure found' });
        }

        // Calculate distance
        const distance = calculateDistance(userLat, userLng, treasure.lat, treasure.lng);

        // If the user is too far, deny claim
        if (distance > 5) {
            // or your threshold in meters
            return res.status(400).json({ message: `You are too far! Distance: ${distance} meters` });
        }

        // Check if user already claimed the daily big treasure
        // For hackathon: if user.collectedDailyTreasure is "today", give smaller reward
        let now = new Date();
        let lastClaimDate = user.collectedDailyTreasure;
        let reward = 0;

        const isSameDay = lastClaimDate && (
            lastClaimDate.getDate() === now.getDate() &&
            lastClaimDate.getMonth() === now.getMonth() &&
            lastClaimDate.getFullYear() === now.getFullYear()
        );

        if (!isSameDay) {
            // user hasn't claimed today's big reward
            reward = treasure.rewardAmount; // e.g. 1000
            user.collectedDailyTreasure = now;
        } else {
            // user has already claimed big reward => smaller reward
            reward = getRandomSmallReward(); // e.g. between 10 and 100
        }

        // Update user Berries
        user.totalBerries += reward;
        await user.save();

        res.status(200).json({
            message: `Treasure claimed! You earned ${reward} Berries.`,
            newTotal: user.totalBerries
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Simple Haversine distance function
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const toRad = (val) => val * Math.PI / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d; // distance in meters
}

// For smaller subsequent rewards
function getRandomSmallReward() {
    // e.g. random between 10 and 100
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

module.exports = router;
