const express = require('express');
const router = express.Router();

const { getVendors, getVendorById, createVendor, updateVendor, deleteVendor } = require('../controllers/vendorController');

router.get('/', getVendors);
router.get('/:id', getVendorById);
router.post('/', createVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
