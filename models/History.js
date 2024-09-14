const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now },
    last: Number
});

const History = mongoose.model('History', historySchema);

module.exports = History;
