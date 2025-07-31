import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Helper: format order object
const formatOrder = (order) => ({
  id: order._id.toString(),
  user: order.user?._id
    ? {
        id: order.user._id.toString(),
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
      }
    : undefined,
  userEmail: order.userEmail,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  customerAddress: order.customerAddress,
  items: order.items.map((item) => ({
    id: item.menuItem?.toString() || item.id || '',
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  })),
  subtotal: order.subtotal,
  tax: order.tax,
  total: order.total,
  paymentMethod: order.paymentMethod,
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

// ============================
// 🔹 Get all orders (admin)
// ============================
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(formatOrder);
    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message,
    });
  }
});

// ============================
// 🔹 Get user's orders
// ============================
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(formatOrder);
    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user orders',
      message: error.message,
    });
  }
});

// ============================
// ✅ Place new order (fixed)
// ============================
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
    } = req.body;

    const formattedItems = items.map((item) => ({
      menuItem: item.id, // ✅ Required ObjectId ref
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    const order = new Order({
      user: req.user.userId,
      userEmail: req.user.email,
      customerName,
      customerPhone,
      customerAddress,
      items: formattedItems,
      subtotal,
      tax,
      total,
      paymentMethod,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: req.user.userId });

    res.status(201).json({
      success: true,
      data: formatOrder(order),
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place order',
      message: error.message,
    });
  }
});

// ============================
// 🔹 Update order status
// ============================
router.put('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || orderId === 'undefined') {
      return res.status(400).json({ success: false, error: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate(
      'user',
      'firstName lastName email'
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: formatOrder(order),
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message,
    });
  }
});

export default router;
