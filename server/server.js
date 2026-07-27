try { require('dotenv').config(); } catch (e) {}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const connectDB = require('./config/db');
const { seedData } = require('./controllers/customerController');

// Connect to database and seed sample data if empty
connectDB().then(() => {
  seedData({}, { json: () => {}, status: () => ({ json: () => {} }) }, () => {}).catch(console.error);
});

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/mutual-funds', require('./routes/mutualFund'));
app.use('/api/sip-plans', require('./routes/sipPlan'));
app.use('/api/lumpsum-plans', require('./routes/lumpsumPlan'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/customers', require('./routes/customer'));
app.use('/api/contact', require('./routes/contact'));

// Root Welcome Route
app.get('/', (req, res, next) => {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  if (require('fs').existsSync(clientDistPath)) return next();
  res.json({
    status: 'Success',
    message: 'YS Investment Consultants Backend API is Live!',
    healthCheck: '/api/health',
    endpoints: [
      '/api/insurance',
      '/api/mutual-funds',
      '/api/sip-plans',
      '/api/lumpsum-plans',
      '/api/contact'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YS Investment Consultants API is running' });
});

// Serve frontend client dist static build in production if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
