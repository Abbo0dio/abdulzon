import Product from '../../models/Product.js';

const validateNumeric = (value, field) => {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    const err = new Error(`${field} must be a non-negative number`);
    err.statusCode = 400;
    throw err;
  }
};

const sanitizePayload = (payload, isPartial = false) => {
  const allowedFields = ['title', 'description', 'price', 'category', 'imageUrl', 'stock'];
  const data = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    } else if (!isPartial) {
      data[field] = undefined;
    }
  });
  if (!isPartial) {
    if (!data.title || !data.category) {
      const err = new Error('Title and category are required');
      err.statusCode = 400;
      throw err;
    }
    if (data.price === undefined || data.stock === undefined) {
      const err = new Error('Price and stock are required');
      err.statusCode = 400;
      throw err;
    }
  }
  if (data.price !== undefined) validateNumeric(data.price, 'Price');
  if (data.stock !== undefined) validateNumeric(data.stock, 'Stock');
  return data;
};

export const listProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(Math.min(parseInt(req.query.limit || '20', 10), 100), 1);
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));
    res.json({
      items,
      total,
      page,
      pages
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const payload = sanitizePayload(req.body);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Product not found';
    }
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const payload = sanitizePayload(req.body, false);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Product not found';
    }
    next(error);
  }
};

export const patchProduct = async (req, res, next) => {
  try {
    const payload = sanitizePayload(req.body, true);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Product not found';
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Product not found';
    }
    next(error);
  }
};
