const Order = require('../models/order.model');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 500;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
      deliveryFee: 500
    });

    // Emit socket event for new order
    const io = req.app.get('io');
    if (io) {
      io.emit(`order:status:${order._id}`, {
        orderId: order._id,
        status: 'pending',
        message: 'Order placed successfully!'
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('rider', 'name avatar');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update order status and emit real-time notification
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Emit socket event for status update
    const io = req.app.get('io');
    if (io) {
      io.emit(`order:status:${order._id}`, {
        orderId: order._id,
        status: order.status,
        message: `Order ${status}!`
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};