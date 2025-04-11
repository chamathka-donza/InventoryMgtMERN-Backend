const Vendor = require('../models/vendor');

// Get all vendors
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        res.status(200).json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
    const { id } = req.params;
    try {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to generate next vendor_code
const generateVendorCode = async () => {
    const lastVendor = await Vendor.findOne().sort({ vendor_code: -1 }).select('vendor_code');
    let nextCode = 1;
    if (lastVendor) {
        nextCode = parseInt(lastVendor.vendor_code) + 1;
    }
    return nextCode.toString().padStart(6, '0'); // Ensures 6-digit format
};

// Create a new vendor
const createVendor = async (req, res) => {
    const { vendor_name, contact_no } = req.body;
    try {
        const vendor_code = await generateVendorCode();

        const vendor = new Vendor({
            vendor_code,
            vendor_name,
            contact_no
        });

        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update vendor
const updateVendor = async (req, res) => {
    const { vendor_name, contact_no } = req.body;
    const { id } = req.params;
    try {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        vendor.vendor_name = vendor_name;
        vendor.contact_no = contact_no;
        await vendor.save();

        res.status(200).json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete vendor
const deleteVendor = async (req, res) => {
    const { id } = req.params;
    try {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        await Vendor.findByIdAndDelete(id);
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};
