require('dotenv').config(); // loads .env
const express = require('express');
const connectDB = require('./config/db'); // if using a separate db file
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const treasureRoutes = require('./routes/treasureRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON

// Routes
app.use('/api/users', userRoutes);
app.use('/api/treasure', treasureRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
