const mongoose = require('mongoose');

// Location Schema
const locationSchema = new mongoose.Schema({
    loc_code: { type: String, unique: true },
    loc_name: { type: String, required: true },
    loc_address: { type: String, required: true }
});


// Pre-save hook to assign loc_code
locationSchema.pre('save', async function (next) {
    if (!this.loc_code) {
        this.loc_code = await generateLocCode();
    }
    next();
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
