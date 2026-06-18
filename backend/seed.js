const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
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
        title: "Apple iPhone 15 Pro (Titanium, 256 GB)",
        description: "Experience the power of the A17 Pro chip and a stunning titanium design.",
        mainImg: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80"
        ],
        category: "Electronics",
        price: 1199.00,
        discount: 5,
        sizes: ["256GB", "512GB"]
      },
      {
        title: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry leading noise cancellation with auto noise canceling optimizer.",
        mainImg: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
        ],
        category: "Electronics",
        price: 348.00,
        discount: 10,
        sizes: ["Standard"]
      },
      {
        title: "Levi's Men's Original Fit Jeans",
        description: "The classic straight fit. Our signature straight fit with iconic styling.",
        mainImg: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80"
        ],
        category: "Clothing",
        gender: "Men",
        price: 69.50,
        discount: 15,
        sizes: ["30W", "32W", "34W"]
      },
      {
        title: "Nike Air Max 270 Running Shoes",
        description: "Max Air 270 unit delivers unrivaled, all-day comfort.",
        mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80"
        ],
        category: "Shoes",
        gender: "Men",
        price: 160.00,
        discount: 0,
        sizes: ["8", "9", "10", "11"]
      },
      {
        title: "Samsung 65-Inch Class QLED 4K Smart TV",
        description: "100% Color Volume with Quantum Dot technology.",
        mainImg: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80"
        ],
        category: "Electronics",
        price: 897.99,
        discount: 20,
        sizes: ["65 Inch"]
      },
      {
        title: "Adidas Originals Women's Stan Smith",
        description: "Classic court shoes with a minimalist design.",
        mainImg: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500&q=80"
        ],
        category: "Shoes",
        gender: "Women",
        price: 100.00,
        discount: 25,
        sizes: ["6", "7", "8"]
      },
      {
        title: "Canon EOS R5 Mirrorless Digital Camera",
        description: "45MP Full-Frame CMOS Sensor, 8K Video Recording.",
        mainImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"
        ],
        category: "Electronics",
        price: 3899.00,
        discount: 0,
        sizes: ["Body Only"]
      },
      {
        title: "Calvin Klein Women's Modern Cotton Bralette",
        description: "Super soft, comfortable cotton blend with iconic logo band.",
        mainImg: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80"
        ],
        category: "Clothing",
        gender: "Women",
        price: 28.00,
        discount: 10,
        sizes: ["S", "M", "L"]
      },
      {
        title: "Ninja Air Fryer Max XL",
        description: "Cooks, crisps, roasts, bakes, reheats and dehydrates.",
        mainImg: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80"
        ],
        category: "Home & Kitchen",
        price: 159.99,
        discount: 30,
        sizes: ["5.5 Quart"]
      },
      {
        title: "Fossil Men's Machine Stainless Steel Chronograph",
        description: "Industrial details with a knurled texture case.",
        mainImg: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80"
        ],
        category: "Accessories",
        gender: "Men",
        price: 145.00,
        discount: 15,
        sizes: ["Standard"]
      },
      {
        title: "YETI Rambler 20 oz Tumbler",
        description: "Stainless steel, vacuum insulated with MagSlider lid.",
        mainImg: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"
        ],
        category: "Home & Kitchen",
        price: 35.00,
        discount: 0,
        sizes: ["20 oz"]
      },
      {
        title: "Ray-Ban Classic Aviator Sunglasses",
        description: "The classic aviator style with G-15 polarized lenses.",
        mainImg: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"
        ],
        category: "Accessories",
        gender: "Unisex",
        price: 163.00,
        discount: 5,
        sizes: ["One Size"]
      },
      {
        title: "Logitech MX Master 3S Wireless Mouse",
        description: "Ultrafast scrolling, ergonomic design, 8K DPI.",
        mainImg: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"
        ],
        category: "Electronics",
        price: 99.99,
        discount: 10,
        sizes: ["Standard"]
      },
      {
        title: "North Face Men's Resolve 2 Jacket",
        description: "Waterproof, breathable seam-sealed DryVent jacket.",
        mainImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
        ],
        category: "Clothing",
        gender: "Men",
        price: 90.00,
        discount: 20,
        sizes: ["M", "L", "XL"]
      },
      {
        title: "Vitamix 5200 Professional-Grade Blender",
        description: "Variable speed control, large 64 oz container.",
        mainImg: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80"
        ],
        category: "Home & Kitchen",
        price: 479.95,
        discount: 15,
        sizes: ["64 oz"]
      },
      {
        title: "Michael Kors Jet Set Travel Tote",
        description: "Saffiano leather tote with gold-tone hardware.",
        mainImg: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80"
        ],
        category: "Accessories",
        gender: "Women",
        price: 198.00,
        discount: 25,
        sizes: ["One Size"]
      },
      {
        title: "Asus ROG Strix G15 Gaming Laptop",
        description: "15.6” 144Hz IPS Type FHD, NVIDIA GeForce RTX 3050.",
        mainImg: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80"
        ],
        category: "Electronics",
        price: 999.99,
        discount: 8,
        sizes: ["15.6 Inch"]
      },
      {
        title: "Zara Women's Oversized Blazer",
        description: "Long sleeve lapel collar blazer with front flap pockets.",
        mainImg: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&q=80"
        ],
        category: "Clothing",
        gender: "Women",
        price: 89.90,
        discount: 0,
        sizes: ["S", "M"]
      },
      {
        title: "Nespresso VertuoPlus Coffee Maker",
        description: "Brews 4 different cup sizes, heats up in 20 seconds.",
        mainImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"
        ],
        category: "Home & Kitchen",
        price: 159.00,
        discount: 35,
        sizes: ["Standard"]
      },
      {
        title: "Apple Watch Series 9",
        description: "S9 chip, brighter display, and double tap gesture.",
        mainImg: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        carousel: [
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"
        ],
        category: "Electronics",
        price: 399.00,
        discount: 5,
        sizes: ["41mm", "45mm"]
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Database seeded successfully with 20 products!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
