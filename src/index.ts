import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // <-- নিশ্চিত করুন এই লাইনটি ঠিক এভাবে লেখা আছে

// Health check
app.get('/', (req, res) => {
  res.send('GoodGather API is running smoothly.');
});

// Database & Server Run
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
  });
});