import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import articleRoutes from './routes/articles.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ✅ FIX 1: Better CORS for production (Vercel + Render)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://unseenhealth.vercel.app' // replace with your real Vercel URL
  ],
  credentials: true
}));

app.use(express.json());

// Static files (for images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ✅ FIX 2: MongoDB connection with safer options
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });