const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, title, description, mainImg, quantity, size, price, discount } = req.body;
    
    // Check if item already exists in cart with same size
    let cartItem = await Cart.findOne({ userId: req.user.id, productId, size });
    
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user.id,
        productId,
        title,
        description,
        mainImg,
        quantity: quantity || 1,
        size,
        price,
        discount
      });
      await cartItem.save();
    }
    
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
