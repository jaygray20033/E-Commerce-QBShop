import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const paidOrders = await Order.countDocuments({ isPaid: true });
  const deliveredOrders = await Order.countDocuments({ isDelivered: true });

  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ isAdmin: true });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersLastWeek = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const revenueByDay = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$paidAt' },
        },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalQuantity: { $sum: '$orderItems.qty' },
        totalRevenue: {
          $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] },
        },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    paidOrders,
    deliveredOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalUsers,
    adminUsers,
    regularUsers: totalUsers - adminUsers,
    newUsersLastWeek,
    revenueByDay,
    topProducts,
    userGrowth,
    recentOrders,
  });
});

export { getDashboardStats };
