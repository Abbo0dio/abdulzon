import Order from '../../models/Order.js';

const buildOrderFilter = (query) => {
  const filter = {};
  if (query.status) {
    filter.orderStatus = query.status;
  }
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) {
      filter.createdAt.$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      filter.createdAt.$lte = new Date(query.dateTo);
    }
  }
  if (query.minSubtotal) {
    filter.subtotal = { ...(filter.subtotal || {}), $gte: Number(query.minSubtotal) };
  }
  if (query.maxSubtotal) {
    filter.subtotal = { ...(filter.subtotal || {}), $lte: Number(query.maxSubtotal) };
  }
  return filter;
};

export const listOrders = async (req, res, next) => {
  try {
    const filter = buildOrderFilter(req.query);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Order not found';
    }
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      const err = new Error('orderStatus is required');
      err.statusCode = 400;
      throw err;
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Order not found';
    }
    next(error);
  }
};
