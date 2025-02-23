const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    totalBerries: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    collectedDailyTreasure: { type: Date, default: null },
});

module.exports = mongoose.model('User', userSchema);
