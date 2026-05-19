import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Article from '../models/Article.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// PUBLIC: Get all published articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Get all articles (including unpublished)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Create article
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || '';
    const article = new Article({ ...req.body, image: imageUrl });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN: Update article
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const article = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN: Delete article
router.delete('/:id', auth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
