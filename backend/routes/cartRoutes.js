const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, cartController.getCart)
  .post(protect, cartController.addToCart)
  .delete(protect, cartController.clearCart);

router.delete('/:id', protect, cartController.removeFromCart);

module.exports = router;
