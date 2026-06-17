const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    desc: String,
    image: String,
    size: String,
    quantity: Number,
    price: Number,
    discount: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
