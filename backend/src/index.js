import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import articleRoutes from './routes/articles.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Railway provides PORT automatically
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // later replace with your Vercel frontend URL
  credentials: true
}));

app.use(express.json());

// Static uploads folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection + server start
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