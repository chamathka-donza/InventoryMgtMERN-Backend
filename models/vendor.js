const mongoose = require('mongoose');

// Vendor Schema
const vendorSchema = new mongoose.Schema({
    vendor_code: { type: String, unique: true },
    vendor_name: { type: String, required: true },
    contact_no: { type: String, required: true }
});


// Pre-save hook to assign vendor_code
vendorSchema.pre('save', async function (next) {
    if (!this.vendor_code) {
        this.vendor_code = await generateVendorCode();
    }
    next();
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
