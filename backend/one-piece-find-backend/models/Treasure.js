const mongoose = require('mongoose');

const treasureSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    rewardAmount: { type: Number, default: 1000 }, // daily big reward
    isBigTreasure: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }, // for reference
});

module.exports = mongoose.model('Treasure', treasureSchema);
