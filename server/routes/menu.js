import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// ✅ Helper to format a single menu item
const formatMenuItem = (item) => ({
  id: item._id.toString(),
  name: item.name,
  description: item.description,
  price: item.price,
  image: item.image,
  category: item.category,
  rating: item.rating,
  likes: item.likes,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
});

// ✅ Get all active menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: menuItems.map(formatMenuItem)
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items',
      message: error.message
    });
  }
});

// ✅ Add new menu item (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category, rating, likes } = req.body;

    const menuItem = new MenuItem({
      name,
      description,
      price,
      image,
      category,
      rating: rating || 0,
      likes: likes || 0
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      data: formatMenuItem(menuItem),
      message: 'Menu item added successfully'
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add menu item',
      message: error.message
    });
  }
});

// ✅ Update menu item (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: formatMenuItem(menuItem),
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu item',
      message: error.message
    });
  }
});

// ✅ Soft delete (set isActive: false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu item',
      message: error.message
    });
  }
});

// ✅ Initialize default items (only if none exist)
router.post('/initialize', async (req, res) => {
  try {
    const count = await MenuItem.countDocuments({ isActive: true });

    if (count === 0) {
      const defaultItems = [
        {
          name: 'Italian IceCream',
          description: 'Eat it now',
          price: 12.99,
          image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Desserts',
          rating: 4,
          likes: 1000
        },
        {
          name: 'Chilaquiles',
          description: 'Tortilla chips simmered in a red or green salsa',
          price: 16.99,
          image: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Snacks',
          rating: 5,
          likes: 0
        },
        {
          name: 'Tamales',
          description: 'Steamed masa filled with meats or vegetables',
          price: 8.99,
          image: 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Snacks',
          rating: 5,
          likes: 3574
        },
        {
          name: 'Burrito',
          description: 'A large flour tortilla filled with beans, rice, and meat',
          price: 14.99,
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Snacks',
          rating: 4,
          likes: 546
        },
        {
          name: 'Nachos',
          description: 'Crispy tortilla chips loaded with cheese and toppings',
          price: 11.99,
          image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Appetizers',
          rating: 5,
          likes: 567
        },
        {
          name: 'Churros',
          description: 'Fried dough pastries rolled in cinnamon sugar, served with chocolate sauce',
          price: 7.99,
          image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Desserts',
          rating: 3,
          likes: 0
        },
        {
          name: 'Pozole Rojo',
          description: 'Traditional soup with hominy, pork, and red chiles, garnished with radish and lime',
          price: 18.99,
          image: 'https://images.pexels.com/photos/5737385/pexels-photo-5737385.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Soups',
          rating: 4,
          likes: 0
        },
        {
          name: 'Mole Poblano',
          description: 'Tender chicken simmered in a rich mole sauce with chocolate and spices, served with rice',
          price: 22.99,
          image: 'https://images.pexels.com/photos/6538884/pexels-photo-6538884.jpeg?auto=compress&cs=tinysrgb&w=300',
          category: 'Main Course',
          rating: 0,
          likes: 0
        }
      ];

      await MenuItem.insertMany(defaultItems);

      res.json({
        success: true,
        message: 'Default menu items initialized',
        count: defaultItems.length
      });
    } else {
      res.json({
        success: true,
        message: 'Menu items already exist',
        count
      });
    }
  } catch (error) {
    console.error('Initialize menu items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize menu items',
      message: error.message
    });
  }
});

export default router;
