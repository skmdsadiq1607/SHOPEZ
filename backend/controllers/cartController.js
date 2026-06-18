const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, title, description, mainImg, quantity, size, price, discount } = req.body;
  try {
    // Check if item already exists in user's cart (same product ID and size)
    let cartItem = await Cart.findOne({ userId: req.user._id, productId, size });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        productId,
        title,
        description,
        mainImg,
        quantity,
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

exports.updateCartItem = async (req, res) => {
  const { quantity, size } = req.body;
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    if (quantity !== undefined) cartItem.quantity = quantity;
    if (size !== undefined) cartItem.size = size;

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
