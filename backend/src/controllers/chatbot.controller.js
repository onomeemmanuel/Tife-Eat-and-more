const FoodItem = require('../models/FoodItem.model');

const chatSessions = {};
const DELIVERY_FEE = 500;

const formatCurrency = (value) => `₦${Number(value || 0).toLocaleString()}`;

const defaultMenu = [
  { _id: 'sample-1', name: 'Classic Smash Burger', price: 4500, description: 'Double smash patty with cheddar and pickles' },
  { _id: 'sample-2', name: 'Pepperoni Pizza', price: 6800, description: 'Loaded pepperoni pizza' },
  { _id: 'sample-3', name: 'Crispy Fried Chicken', price: 3800, description: 'Crispy chicken with slaw' },
  { _id: 'sample-4', name: 'Nutella Waffle', price: 3200, description: 'Belgian waffle with Nutella' }
];

const getMenuItems = async () => {
  try {
    const foods = await FoodItem.find({ isAvailable: true }).sort({ price: 1 }).limit(8);
    if (foods.length > 0) {
      return foods.map((food) => ({
        _id: food._id,
        name: food.name,
        price: food.price,
        description: food.description || 'Freshly prepared meal'
      }));
    }
  } catch (error) {
    console.error('Chatbot menu lookup failed:', error.message);
  }

  return defaultMenu;
};

const getOrderSummary = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const total = subtotal + DELIVERY_FEE;
  return { subtotal, deliveryFee: DELIVERY_FEE, total };
};

const ensureSession = (deviceId) => {
  if (!chatSessions[deviceId]) {
    chatSessions[deviceId] = {
      deviceId,
      currentOrder: [],
      orderHistory: [],
      awaitingSelection: false,
      awaitingQuantity: false,
      pendingItem: null,
      pendingPaymentOrder: null,
      lastPlacedOrder: null,
      createdAt: new Date().toISOString()
    };
  }
  return chatSessions[deviceId];
};

const buildMainMenu = () => [
  'Select 1 to place an order',
  'Select 99 to checkout order',
  'Select 98 to see order history',
  'Select 97 to see current order',
  'Select 0 to cancel order'
].join('\n');

const buildMenuText = (menuItems) => {
  const lines = menuItems.map((food, index) => `${index + 1}. ${food.name} — ${formatCurrency(food.price)}\n   ${food.description}`);
  return ['Here is our menu:', ...lines, '', 'Reply with the item number to add it to your order.'].join('\n');
};

const formatOrderItems = (items = []) => {
  if (!items.length) return 'No items yet';
  return items.map((item) => `• ${item.name} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`).join('\n');
};

exports.getChatbotSession = async (req, res) => {
  try {
    const { deviceId } = req.query;
    if (!deviceId) return res.status(400).json({ success: false, message: 'Device ID is required' });

    const session = ensureSession(deviceId);
    res.json({
      success: true,
      message: 'Welcome to Tife Eat and more chatbot.\n' + buildMainMenu(),
      sessionId: session.deviceId,
      options: ['1', '99', '98', '97', '0']
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleChatMessage = async (req, res) => {
  try {
    const { deviceId, message } = req.body;
    if (!deviceId) return res.status(400).json({ success: false, message: 'Device ID is required' });

    const session = ensureSession(deviceId);
    const input = String(message || '').trim();

    if (!input) {
      return res.json({ success: true, message: 'Please enter a valid option.' });
    }

    if (session.awaitingQuantity && session.pendingItem) {
      const quantity = Number(input);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
        return res.json({ success: true, message: 'Please enter a quantity between 1 and 5.' });
      }

      const existingItem = session.currentOrder.find((item) => item._id === session.pendingItem._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        session.currentOrder.push({
          _id: session.pendingItem._id,
          name: session.pendingItem.name,
          price: Number(session.pendingItem.price || 0),
          quantity,
          description: session.pendingItem.description
        });
      }

      session.awaitingQuantity = false;
      session.pendingItem = null;
      const summary = getOrderSummary(session.currentOrder);
      return res.json({
        success: true,
        message: `Added ${quantity} x ${session.pendingItem ? session.pendingItem.name : 'item'} to your current order.\n\nCurrent subtotal: ${formatCurrency(summary.subtotal)}\nDelivery fee: ${formatCurrency(summary.deliveryFee)}\nTotal: ${formatCurrency(summary.total)}\n\n${buildMainMenu()}`,
        currentOrder: session.currentOrder,
        summary
      });
    }

    if (session.awaitingSelection) {
      const parsed = Number(input);
      const menuItems = session.menuItems || [];
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > menuItems.length) {
        return res.json({ success: true, message: 'Please select a valid item number from the list.' });
      }

      const selectedItem = menuItems[parsed - 1];
      session.awaitingSelection = false;
      session.awaitingQuantity = true;
      session.pendingItem = selectedItem;
      return res.json({
        success: true,
        message: `You selected ${selectedItem.name}. Enter quantity (1-5):`
      });
    }

    const normalized = input.toLowerCase();

    if (normalized === '1' || normalized === 'menu') {
      const menuItems = await getMenuItems();
      session.menuItems = menuItems;
      session.awaitingSelection = true;
      session.awaitingQuantity = false;
      session.pendingItem = null;
      return res.json({
        success: true,
        message: buildMenuText(menuItems),
        menuItems
      });
    }

    if (normalized === '99' || normalized === 'checkout' || normalized === 'place order') {
      if (!session.currentOrder.length) {
        return res.json({
          success: true,
          message: 'No order to place. Select 1 to place a new order.'
        });
      }

      const summary = getOrderSummary(session.currentOrder);
      const placedOrder = {
        id: `chat-${Date.now()}`,
        items: session.currentOrder.map((item) => ({ ...item })),
        totalAmount: summary.total,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      session.orderHistory.unshift(placedOrder);
      session.lastPlacedOrder = placedOrder;
      session.pendingPaymentOrder = placedOrder;
      session.currentOrder = [];
      session.awaitingSelection = false;
      session.awaitingQuantity = false;
      session.pendingItem = null;

      return res.json({
        success: true,
        message: `Order placed successfully.\nTotal: ${formatCurrency(summary.total)}\n\nPay now to confirm your payment.\n${buildMainMenu()}`,
        order: placedOrder,
        paymentRequired: true,
        summary
      });
    }

    if (normalized === '98' || normalized === 'history' || normalized === 'order history') {
      if (!session.orderHistory.length) {
        return res.json({ success: true, message: 'You have no placed orders yet.' });
      }

      const historyText = session.orderHistory.map((order, index) => {
        const base = `${index + 1}. Order ${order.id}\n   Total: ${formatCurrency(order.totalAmount)}\n   Status: ${order.paymentStatus === 'paid' ? 'Paid' : 'Pending payment'}`;
        return base;
      }).join('\n\n');

      return res.json({ success: true, message: `Your placed orders:\n\n${historyText}\n\n${buildMainMenu()}`, orderHistory: session.orderHistory });
    }

    if (normalized === '97' || normalized === 'current order' || normalized === 'current') {
      if (!session.currentOrder.length) {
        return res.json({ success: true, message: 'You do not have a current order.' });
      }

      const summary = getOrderSummary(session.currentOrder);
      return res.json({
        success: true,
        message: `Current order:\n\n${formatOrderItems(session.currentOrder)}\n\nSubtotal: ${formatCurrency(summary.subtotal)}\nDelivery fee: ${formatCurrency(summary.deliveryFee)}\nTotal: ${formatCurrency(summary.total)}\n\n${buildMainMenu()}`,
        currentOrder: session.currentOrder,
        summary
      });
    }

    if (normalized === '0' || normalized === 'cancel' || normalized === 'cancel order') {
      if (!session.currentOrder.length) {
        return res.json({ success: true, message: 'There is no active order to cancel.' });
      }

      session.currentOrder = [];
      session.awaitingSelection = false;
      session.awaitingQuantity = false;
      session.pendingItem = null;
      return res.json({ success: true, message: 'Your current order has been cancelled.\n\n' + buildMainMenu() });
    }

    if (normalized === 'pay' || normalized === 'pay now') {
      if (!session.pendingPaymentOrder) {
        return res.json({ success: true, message: 'There is no pending payment right now. Select 1 to place a new order.' });
      }

      return res.json({
        success: true,
        message: 'Your payment is ready. Use the Pay now button below to complete it.',
        paymentRequired: true,
        order: session.pendingPaymentOrder
      });
    }

    return res.json({ success: true, message: `Invalid input.\n\n${buildMainMenu()}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markOrderPaid = async (req, res) => {
  try {
    const { deviceId, orderId } = req.body;
    if (!deviceId) return res.status(400).json({ success: false, message: 'Device ID is required' });

    const session = ensureSession(deviceId);
    const targetOrder = session.orderHistory.find((order) => order.id === orderId) || session.lastPlacedOrder;
    if (!targetOrder) {
      return res.status(404).json({ success: false, message: 'No pending order found' });
    }

    targetOrder.paymentStatus = 'paid';
    targetOrder.paidAt = new Date().toISOString();
    session.pendingPaymentOrder = null;
    session.lastPlacedOrder = targetOrder;

    res.json({
      success: true,
      message: 'Payment successful. Your order is now confirmed and ready for preparation!',
      order: targetOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
