require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const queryRoutes = require('./routes/queryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sdkRoutes = require('./routes/sdkRoutes');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));

// Enable CORS
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', queryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sdk', sdkRoutes); // Use /api/sdk because base route is /api usually, or just /sdk. Let's use /api/sdk.

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
