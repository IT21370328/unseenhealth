import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Simple single-admin login using env credentials
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, email });
});

export default router;
