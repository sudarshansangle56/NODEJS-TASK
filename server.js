const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const CryptoData = require('./models/CryptoData');

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views'); // 'views' is the directory for EJS files

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cryptoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Function to fetch and store data
const fetchDataAndStore = async () => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const data = response.data;

        // Get the top 10 results (keys of the response object)
        const keys = Object.keys(data).slice(0, 10);

        for (let key of keys) {
            const { name, last, buy, sell, volume, base_unit } = data[key];
            
            // Upsert operation: Update if exists, insert if not
            await CryptoData.findOneAndUpdate(
                { name },
                { last, buy, sell, volume, base_unit },
                { upsert: true, new: true }
            );
        }
    } catch (error) {
        console.error('Error fetching or storing data:', error);
    }
};

// Fetch and store data initially
fetchDataAndStore();

// Route to get data and render it using EJS
app.get('/', async (req, res) => {
    try {
        const data = await CryptoData.find();
        res.render('index', { data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
