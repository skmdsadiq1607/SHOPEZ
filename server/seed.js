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
      },
      {
        title: 'Ultra Slim 4K Smart TV',
        description: 'Immerse yourself in breathtaking 4K resolution with brilliant colors and smart streaming capabilities.',
        mainImg: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
        category: 'Electronics',
        price: 799.00,
        discount: 10,
        sizes: ['55 Inch', '65 Inch']
      },
      {
        title: 'Pro Gaming Laptop',
        description: 'Dominate the game with high-performance graphics, 144Hz display, and advanced cooling.',
        mainImg: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
        category: 'Electronics',
        price: 1499.00,
        discount: 5,
        sizes: ['15.6 Inch']
      },
      {
        title: 'Minimalist Leather Watch',
        description: 'A sophisticated timepiece featuring genuine leather straps and a sleek, modern dial.',
        mainImg: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
        category: 'Accessories',
        gender: 'Men',
        price: 145.00,
        discount: 25,
        sizes: ['Standard']
      },
      {
        title: 'Canvas Tote Bag',
        description: 'Eco-friendly and spacious, perfect for groceries, books, or a day at the beach.',
        mainImg: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500&q=80',
        category: 'Accessories',
        gender: 'Women',
        price: 24.99,
        discount: 0,
        sizes: ['One Size']
      },
      {
        title: 'Smart Fitness Tracker',
        description: 'Track your heart rate, steps, and sleep patterns with this sleek, waterproof fitness band.',
        mainImg: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
        category: 'Electronics',
        price: 59.99,
        discount: 30,
        sizes: ['Adjustable']
      },
      {
        title: 'Ceramic Coffee Mug Set',
        description: 'Start your morning right with these beautifully handcrafted, microwave-safe ceramic mugs.',
        mainImg: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
        category: 'Home & Kitchen',
        price: 34.50,
        discount: 10,
        sizes: ['Set of 4']
      },
      {
        title: 'Cozy Knit Sweater',
        description: 'Stay warm and stylish during the colder months with this incredibly soft, oversized knit sweater.',
        mainImg: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
        category: 'Clothing',
        gender: 'Women',
        price: 54.00,
        discount: 0,
        sizes: ['XS', 'S', 'M', 'L']
      },
      {
        title: 'Stainless Steel Water Bottle',
        description: 'Keep your drinks ice-cold for 24 hours or piping hot for 12 hours with vacuum insulation.',
        mainImg: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
        category: 'Home & Kitchen',
        price: 29.99,
        discount: 15,
        sizes: ['500ml', '750ml', '1L']
      },
      {
        title: 'Wireless Charging Pad',
        description: 'Fast charge your smartphone by simply placing it on this sleek, anti-slip charging pad.',
        mainImg: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&q=80',
        category: 'Electronics',
        price: 39.99,
        discount: 20,
        sizes: ['Standard']
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
