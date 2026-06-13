const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  deliveryFee: { type: Number, default: 500 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  riderLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  estimatedDelivery: { type: String, default: '30-45 min' },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
