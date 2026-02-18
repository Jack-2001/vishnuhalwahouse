const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Workaround: some networks block SRV DNS queries for Atlas. Force reliable
// public DNS servers for Node's resolver so SRV lookups succeed.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('DNS servers set to', dns.getServers());
} catch (e) {
  console.warn('Could not set DNS servers:', e.message || e);
}

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const counterRouter = require('./routes/counter');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/counter', counterRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.send({ ok: true, service: 'Vishnu Halwa Backend' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vishnu-halwa';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
