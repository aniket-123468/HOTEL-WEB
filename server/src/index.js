import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import diningRoutes from './routes/dining.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

// Automatically seed data to ensure the app is fully functional
const { seedData } = await import('./scripts/seed.js');
await seedData();
const app = express();

// Body parser
app.use(express.json());

// Compression
app.use(compression());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/dining', diningRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
  });
} else {
  // Test route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Delhi Line Hotel API' });
  });
}

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
