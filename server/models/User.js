const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['user', 'admin'], default: 'user' },
  name: { type: String },
  mobile: { type: String },
  address: { type: String },
  pincode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
