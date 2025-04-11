const Counter = require('../models/counter');

async function getNextSequence(modelName) {
    const counter = await Counter.findOneAndUpdate(
        { model: modelName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq.toString().padStart(6, '0'); // Convert to 6-digit string
}

module.exports = { getNextSequence };
