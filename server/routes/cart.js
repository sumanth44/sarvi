import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; // ✅ Added
import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';

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

// Helper to format cart items
const formatCartItems = (items) => {
  return items.map(item => ({
    id: item.menuItem._id.toString(),
    name: item.menuItem.name,
    description: item.menuItem.description,
    price: item.menuItem.price,
    image: item.menuItem.image,
    category: item.menuItem.category,
    rating: item.menuItem.rating,
    likes: item.menuItem.likes,
    quantity: item.quantity
  }));
};

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

    if (!cart) return res.json({ success: true, data: [] });

    const cartItems = formatCartItems(cart.items);
    res.json({ success: true, data: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart', message: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const { menuItemId } = req.body;

    const menuItem = await MenuItem.findOne({ _id: menuItemId, isActive: true });
    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ menuItem: menuItemId, quantity: 1 }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.menuItem.toString() === menuItemId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({ menuItem: menuItemId, quantity: 1 });
      }
    }

    await cart.save();
    await cart.populate('items.menuItem');

    const cartItems = formatCartItems(cart.items);
    res.json({ success: true, data: cartItems, message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add item to cart', message: error.message });
  }
});

// Update cart quantity
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const { menuItemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);
    if (itemIndex === -1) return res.status(404).json({ success: false, error: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.menuItem');

    const cartItems = formatCartItems(cart.items);
    res.json({ success: true, data: cartItems, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart', message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:menuItemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);

    await cart.save();
    await cart.populate('items.menuItem');

    const cartItems = formatCartItems(cart.items);
    res.json({ success: true, data: cartItems, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove item from cart', message: error.message });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    await Cart.findOneAndDelete({ user: userId });
    res.json({ success: true, data: [], message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart', message: error.message });
  }
});

export default router;
