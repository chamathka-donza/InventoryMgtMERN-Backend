const mongoose = require('mongoose');
const Brand = require('../models/brand');
const Location = require('../models/location');
const Vendor = require('../models/vendor');
const Product = require('../models/product');

const createProduct = async (req, res) => {
    try {
        const { brand_code, loc_code, vendor_code, ...otherData } = req.body;

        // 🔹 Validate Brand
        const brand = await Brand.findOne({ brand_code });
        if (!brand) return res.status(400).json({ message: `Brand with code ${brand_code} does not exist` });

        // 🔹 Validate Location
        const location = await Location.findOne({ loc_code });
        if (!location) return res.status(400).json({ message: `Location with code ${loc_code} does not exist` });

        // 🔹 Validate Vendor
        const vendor = await Vendor.findOne({ vendor_code });
        if (!vendor) return res.status(400).json({ message: `Vendor with code ${vendor_code} does not exist` });

        // 🔹 Generate `proc_code` before creating the product
        const lastProduct = await Product.findOne().sort({ proc_code: -1 }).select('proc_code');
        let nextProcCode = "000001"; // Default value for first product
        if (lastProduct && lastProduct.proc_code) {
            nextProcCode = (parseInt(lastProduct.proc_code) + 1).toString().padStart(6, '0');
        }

        // 🔹 Create New Product (Now includes `proc_code`)
        const product = new Product({
            proc_code: nextProcCode,
            brand_code: brand._id,
            loc_code: location._id,
            vendor_code: vendor._id,
            ...otherData
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get all products with populated references
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('brand_code loc_code vendor_code');
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a single product by ID with populated references
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('brand_code loc_code vendor_code');

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const { brand_code, loc_code, vendor_code, ...otherData } = req.body;

        // 🔹 Validate Brand
        const brand = await Brand.findOne({ brand_code });
        if (!brand) {
            return res.status(400).json({ message: `Brand with code ${brand_code} does not exist` });
        }

        // 🔹 Validate Location
        const location = await Location.findOne({ loc_code });
        if (!location) {
            return res.status(400).json({ message: `Location with code ${loc_code} does not exist` });
        }

        // 🔹 Validate Vendor
        const vendor = await Vendor.findOne({ vendor_code });
        if (!vendor) {
            return res.status(400).json({ message: `Vendor with code ${vendor_code} does not exist` });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                brand_code: brand._id,
                loc_code: location._id,
                vendor_code: vendor._id,
                ...otherData
            },
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// This function updates the quantity of a product
const updateProductQuantity = async (req, res) => {
    try {
        const { qty } = req.body;  // The new quantity value
        const productId = req.params.id;  // The product ID from the request URL

        // Find the product by its ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the quantity field
        product.qty = qty;  // Update the quantity to the new value
        await product.save();  // Save the updated product

        // Respond with success
        res.status(200).json({ message: 'Quantity updated successfully', product });
    } catch (error) {
        console.error("Error updating product quantity:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({ qty: { $lte: 10 } }).populate('brand_code loc_code vendor_code');
        res.json(lowStockProducts);
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        res.status(500).json({ message: "Error fetching low stock products" });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductQuantity, getLowStockProducts };
