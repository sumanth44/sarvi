import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
  'Appetizers',
  'Main Course',
  'Snacks',
  'Soups',
  'Beverages',
  'Dosa & Uthappa’s',
  'Indo-Chinese',
  'Breads',
  'Veg curries',
  'Non veg curries',
  'Veg biriyani',
  'Non veg biriyani',
  'Puloos',
  'Weekend special',
  'Sides',
  'Desserts'
]

  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('MenuItem', menuItemSchema);