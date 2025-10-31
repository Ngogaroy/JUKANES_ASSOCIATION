import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from api/blog/[slug])...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (Must match api/posts.js) ---
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, default: 'JUKANES Association' },
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// --- CORS Helper ---
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://jukaneswebsite.vercel.app'
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  // 1. Get the slug from the URL query
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ msg: 'Slug not provided' });
  }

  try {
    await connectDB();

    // 2. Find the *one* post in the database that matches the slug
    const post = await Post.findOne({ slug: slug });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // 3. Send the single post data back
    return res.status(200).json({
      msg: 'Post fetched successfully',
      data: post,
    });

  } catch (err) {
    console.error('Error fetching post:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export default handler;