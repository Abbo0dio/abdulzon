import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import { connectDB } from './src/config/db.js';
import { ensureAdminExists } from './src/seed/ensureAdmin.js';

dotenv.config();

const products = [
  {
    title: 'Wireless Earbuds',
    description: 'Lightweight earbuds with charging case and clear audio.',
    price: 59.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1518444028785-8fbcd101ebb9?auto=format&fit=crop&w=600&q=80',
    stock: 25
  },
  {
    title: 'Smart Speaker',
    description: 'Compact smart speaker with voice assistant support.',
    price: 89.99,
    category: 'Electronics',
    imageUrl: 'https://globaltechuae.com/wp-content/uploads/2023/04/9ec0e4c05d36522a4a8cfbbbce3eb980-hi.jpg',
    stock: 15
  },
  {
    title: 'Gaming Mouse',
    description: 'Ergonomic mouse with programmable buttons.',
    price: 39.99,
    category: 'Electronics',
    imageUrl: 'https://www.game.co.uk/images/imgzoom/40/40818703_xxl.jpg',
    stock: 40
  },
  {
    title: 'Stainless Water Bottle',
    description: 'Keeps drinks cold for 24 hours, 1L capacity.',
    price: 24.99,
    category: 'Home',
    imageUrl: 'https://www.ikea.com/ae/en/images/products/enkelsparig-water-bottle-stainless-steel-beige__0985523_pe816659_s5.jpg?f=s',
    stock: 60
  },
  {
    title: 'Pour Over Coffee Maker',
    description: 'Glass carafe with reusable stainless filter.',
    price: 34.99,
    category: 'Home',
    imageUrl: 'https://www.saveur.com/uploads/2021/12/13/pour-over-coffee-makers-guide-v6-pour-over-saveur.jpg?format=webp&optimize=high&precrop=1%3A1%2Csmart',
    stock: 18
  },
  {
    title: 'Adjustable Desk Lamp',
    description: 'LED desk lamp with warm and cool light modes.',
    price: 49.99,
    category: 'Home',
    imageUrl: 'https://images-cdn.ubuy.ae/6939582d34bb39377f000649-lepower-metal-desk-lamp-eye-caring.jpg',
    stock: 22
  },
  {
    title: 'Essential Cookbook',
    description: '100 quick dinner recipes for busy nights.',
    price: 19.99,
    category: 'Books',
    imageUrl: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/01/cookbook3.jpg',
    stock: 35
  },
  {
    title: 'Mystery Novel',
    description: 'Page-turning detective story set in London.',
    price: 14.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    stock: 45
  },
  {
    title: 'Yoga Mat',
    description: 'Non-slip mat suitable for all workouts.',
    price: 29.99,
    category: 'Home',
    imageUrl: 'https://images-cdn.ubuy.ae/65b98bcf46dd762b015aeb37-tahoe-trails-non-slip-thick-yoga-mat-12.jpg',
    stock: 50
  },
  {
    title: 'Laptop Stand',
    description: 'Aluminum stand to improve posture and airflow.',
    price: 44.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/715pvx8UWrL.jpg',
    stock: 30
  }
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/abdulzon';
    await connectDB(mongoUri);
    await Product.deleteMany();
    await Product.insertMany(products);
    await User.deleteMany();
    const passwordHash = await bcrypt.hash('password123', 10);
    const createdProducts = await Product.find().limit(2);
    await User.create({
      name: 'Demo User',
      email: 'demo@abdulzon.com',
      passwordHash,
      likes: createdProducts.map((product) => product._id),
      cart: {
        items: createdProducts.map((product) => ({ product: product._id, quantity: 1 }))
      }
    });
    await ensureAdminExists();
    console.log('Seed data inserted (products + demo user + admin)');
  } catch (error) {
    console.error('Seed failed', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
