const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place an order
router.post('/', async (req, res) => {
  const { items, customer } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'No items' });

  // Validate stock and compute total
  const session = await Product.startSession();
  session.startTransaction();
  try {
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error(`Product not found: ${it.product}`);
      if (prod.stock < it.quantity) throw new Error(`Insufficient stock for ${prod.name}`);
      prod.stock -= it.quantity;
      await prod.save({ session });
      const price = prod.price;
      total += price * it.quantity;
      orderItems.push({ product: prod._id, name: prod.name, quantity: it.quantity, price });
    }

    const order = new Order({ items: orderItems, total, customer });
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// List orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Get order
router.get('/:id', async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  res.json(o);
});

module.exports = router;
