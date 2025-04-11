const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    proc_code: { type: String, required: true, unique: true }, // Auto-generated 6-digit code
    brand_code: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    model_no: { type: String, required: true },
    manuf_country: { type: String, required: true },
    size: { type: String, required: true },
    loc_code: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true }, 
    proc_description: { type: String },
    teeth_qty: { type: Number, required: true },
    engine_model: { type: String },
    vehicle: { type: String },
    buy_price: { type: String, required: true },
    sell_price: { type: String, required: true },
    is_rack: { type: Boolean, default: false },
    vendor_code: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, 
    proc_image: { type: String }, // Optional image URL
    qty: { type: Number, required: true }
});

// 🔹 Compound Unique Index (Ensures uniqueness of product details)
productSchema.index(
    { proc_code: 1, brand_code: 1, model_no: 1, manuf_country: 1, size: 1, loc_code: 1, teeth_qty: 1, buy_price: 1, vendor_code: 1 }, 
    { unique: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
