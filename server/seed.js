const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      username: 'Admin',
      email: 'admin@shopez.com',
      password: hashedPassword,
      usertype: 'admin',
      name: 'ShopEZ Admin',
      mobile: '1234567890',
      address: 'ShopEZ Headquarters',
      pincode: '10001'
    });

    await admin.save();

    const sampleProducts = [
      {
        title: 'Premium Wireless Headphones',
        description: 'Experience crystal clear sound with active noise cancellation and 30-hour battery life.',
        mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        category: 'Electronics',
        price: 199.99,
        discount: 15,
        sizes: ['One Size']
      },
      {
        title: 'Classic Denim Jacket',
        description: 'Timeless style meets modern comfort in this durable, everyday essential jacket.',
        mainImg: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
        category: 'Clothing',
        gender: 'Unisex',
        price: 89.99,
        discount: 0,
        sizes: ['S', 'M', 'L', 'XL']
      },
      {
        title: 'Running Sneakers',
        description: 'Lightweight, breathable, and designed for maximum energy return on every run.',
        mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        category: 'Shoes',
        gender: 'Men',
        price: 129.99,
        discount: 20,
        sizes: ['8', '9', '10', '11']
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
