const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter');

// Ensure counter exists for 'samosa'
async function ensureCounter(name = 'samosa') {
  let c = await Counter.findOne({ name });
  if (!c) {
    c = new Counter({ name, count: 0 });
    await c.save();
  }
  return c;
}

// Get counter
router.get('/:name?', async (req, res) => {
  const name = req.params.name || 'samosa';
  const c = await ensureCounter(name);
  res.json(c);
});

// Increment or set counter
router.post('/:name?/increment', async (req, res) => {
  const name = req.params.name || 'samosa';
  const delta = parseInt(req.body.delta || '1', 10);
  const c = await Counter.findOneAndUpdate({ name }, { $inc: { count: delta } }, { new: true, upsert: true });
  res.json(c);
});

router.post('/:name?/set', async (req, res) => {
  const name = req.params.name || 'samosa';
  const value = parseInt(req.body.value || '0', 10);
  const c = await Counter.findOneAndUpdate({ name }, { count: value }, { new: true, upsert: true });
  res.json(c);
});

module.exports = router;
