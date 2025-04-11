const Brand = require('../models/brand');

// Get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get brand by ID
const getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Generate next brand_code
const generateBrandCode = async () => {
    const lastBrand = await Brand.findOne().sort({ brand_code: -1 }).select('brand_code');
    let nextCode = 1;
    if (lastBrand) {
        nextCode = parseInt(lastBrand.brand_code) + 1;
    }
    return nextCode.toString().padStart(6, '0'); // Ensures 6-digit format
};

// Create a new brand
const createBrand = async (req, res) => {
    const { brand_name, brand_description } = req.body;
    try {
        const brand_code = await generateBrandCode();

        const brand = new Brand({
            brand_code,
            brand_name,
            brand_description
        });

        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update brand
const updateBrand = async (req, res) => {
    const { brand_name, brand_description } = req.body;
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        brand.brand_name = brand_name;
        brand.brand_description = brand_description;
        await brand.save();

        res.status(200).json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete brand
const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        await Brand.findByIdAndDelete(id);
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};
