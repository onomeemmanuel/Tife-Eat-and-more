const express = require('express');
const router = express.Router();
const protect = require('../middleware/middleware');
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/order.controller');

// Public simulate endpoint for demo (no auth)
router.post('/:id/simulate-public', async (req, res) => {
  const Order = require('../models/order.model');
  const STATUSES = ['pending', 'confirmed', 'preparing', 'picked_up', 'delivered'];

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const currentIndex = STATUSES.indexOf(order.status);
    if (currentIndex < STATUSES.length - 1) {
      order.status = STATUSES[currentIndex + 1];
      await order.save();

      // Emit socket event
      const io = req.app.get('io');
      if (io) io.emit(`order:status:${order._id}`, { status: order.status });
    }

    res.json({ success: true, status: order.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
// Simulate order status progression (for testing)
router.post('/:id/simulate', protect, async (req, res) => {
  const Order = require('../models/order.model');
  const STATUSES = ['pending', 'confirmed', 'preparing', 'picked_up', 'delivered'];

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const currentIndex = STATUSES.indexOf(order.status);
    if (currentIndex < STATUSES.length - 1) {
      order.status = STATUSES[currentIndex + 1];
      await order.save();

      // Emit socket event
      const io = req.app.get('io');
      io.emit(`order:status:${order._id}`, { status: order.status });
    }

    res.json({ success: true, status: order.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Public simulate endpoint for demo (no auth)
router.post('/:id/simulate-public', async (req, res) => {
  const Order = require('../models/order.model');
  const STATUSES = ['pending', 'confirmed', 'preparing', 'picked_up', 'delivered'];

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const currentIndex = STATUSES.indexOf(order.status);
    if (currentIndex < STATUSES.length - 1) {
      order.status = STATUSES[currentIndex + 1];
      await order.save();

      // Emit socket event
      const io = req.app.get('io');
      if (io) io.emit(`order:status:${order._id}`, { status: order.status });
    }

    res.json({ success: true, status: order.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;