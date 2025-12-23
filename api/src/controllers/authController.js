import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { attachAuthCookie, clearAuthCookie, generateToken } from '../utils/token.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  likes: user.likes,
  cartItemCount: user.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      const err = new Error('Email is already in use');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      likes: [],
      cart: { items: [] }
    });

    const token = generateToken(user._id.toString());
    attachAuthCookie(res, token);

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user._id.toString());
    attachAuthCookie(res, token);

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
};

export const currentUser = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
