const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brand_code: { type: String, unique: true, required: true },  // 6-character string
    brand_name: { type: String, required: true },
    brand_description: { type: String } // Optional
});

// Pre-save hook to generate a 6-digit brand_code
brandSchema.pre('save', async function (next) {
    if (!this.brand_code) {
        try {
            const lastBrand = await mongoose.model('Brand').findOne().sort({ brand_code: -1 });

            let newCode = "000001"; // Default for first record
            if (lastBrand) {
                const maxCode = parseInt(lastBrand.brand_code, 10);
                newCode = String(maxCode + 1).padStart(6, '0'); // Ensure 6-digit format
            }

            this.brand_code = newCode;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
