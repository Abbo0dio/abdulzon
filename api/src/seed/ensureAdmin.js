import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import User from '../models/User.js';

export const ensureAdminExists = async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB(env.mongoUri);
  }
  // Look for the same email we seed with to avoid duplicate creation attempts
  const existing = await User.findOne({ email: 'admin@admin.com' });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
    return existing;
  }
  const passwordHash = await bcrypt.hash('admin', 10);
  const admin = await User.create({
    name: 'Administrator',
    email: 'admin@admin.com',
    passwordHash,
    role: 'admin',
    likes: [],
    cart: { items: [] }
  });
  return admin;
};

const isEntry = process.argv[1] === new URL(import.meta.url).pathname;
if (isEntry) {
  ensureAdminExists()
    .then(() => {
      console.log('Admin ensured');
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.error('Failed to ensure admin', err);
      process.exit(1);
    });
}
