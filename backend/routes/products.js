const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// List products
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Get single product
router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Create product (admin)
router.post('/', authenticateToken, adminOnly, async (req, res) => {
  const data = req.body;
  const p = new Product(data);
  await p.save();
  res.status(201).json(p);
});

// Update product (admin)
router.put('/:id', authenticateToken, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Delete product (admin)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
