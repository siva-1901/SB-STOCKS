const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockById,
  getTopMovers,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/movers/top', getTopMovers);
router.get('/', getStocks);
router.get('/:id', getStockById);
router.post('/', protect, admin, createStock);
router.put('/:id', protect, admin, updateStock);
router.delete('/:id', protect, admin, deleteStock);

module.exports = router;
