const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Burgers', 'Pizza', 'Drinks', 'Sides', 'Desserts', 'Chicken'],
    required: true
  },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  prepTime: { type: String, default: '15-20 min' },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);