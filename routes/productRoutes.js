const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductQuantity, getLowStockProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/update-quantity/:id', updateProductQuantity);

module.exports = router;
