const express = require('express');
const router = express.Router();

const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
