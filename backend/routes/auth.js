const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'create_admin_secret';

// Register admin (protected by ADMIN_SECRET to avoid open registration)
router.post('/register', async (req, res) => {
  try {
    const { username, password, adminSecret } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ error: 'Invalid admin secret' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ username, passwordHash: hash, role: 'admin' });
    await user.save();
    res.status(201).json({ ok: true, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
