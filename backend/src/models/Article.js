import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    teaser: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    image: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: '5 min read' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Article', articleSchema);
