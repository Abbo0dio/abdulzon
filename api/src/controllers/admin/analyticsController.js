import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

export const summary = async (_req, res, next) => {
  try {
    const [orderStats] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$subtotal' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [recent] = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          revenueLast7Days: { $sum: '$subtotal' },
          ordersLast7Days: { $sum: 1 }
        }
      }
    ]);

    const [totalUsers, totalProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments()
    ]);

    res.json({
      totalRevenue: orderStats?.totalRevenue || 0,
      totalOrders: orderStats?.totalOrders || 0,
      totalUsers,
      totalProducts,
      revenueLast7Days: recent?.revenueLast7Days || 0,
      ordersLast7Days: recent?.ordersLast7Days || 0
    });
  } catch (error) {
    next(error);
  }
};

export const salesByDay = async (req, res, next) => {
  try {
    const days = Math.max(parseInt(req.query.days || '7', 10), 1);
    const since = new Date();
    since.setDate(since.getDate() - days + 1);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$subtotal' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(
      data.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        ordersCount: item.ordersCount
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const topProducts = async (req, res, next) => {
  try {
    const limit = Math.max(parseInt(req.query.limit || '5', 10), 1);
    const data = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          title: { $first: '$items.title' },
          totalQuantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit }
    ]);

    res.json(
      data.map((item) => ({
        productId: item._id,
        title: item.title,
        totalQuantity: item.totalQuantity,
        revenue: item.revenue
      }))
    );
  } catch (error) {
    next(error);
  }
};
