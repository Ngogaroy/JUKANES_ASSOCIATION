import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from api/posts)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (for Blog Posts) ---
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // For the URL, e.g., /blog/my-first-post
  content: { type: String, required: true }, // The main blog post content
  imageUrl: { type: String }, // Optional cover image
  author: { type: String, default: 'JUKANES Association' },
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// --- CORS Helper ---
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000', // For vercel dev
    'https://jukaneswebsite.vercel.app' // YOUR LIVE VERCEL URL
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Slugify Function (to create clean URLs) ---
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({ msg: 'Database connection failed' });
  }

  // --- GET Request (Fetch all posts) ---
  if (req.method === 'GET') {
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 }); // Get newest first
      return res.status(200).json({
        msg: 'Posts fetched successfully',
        count: posts.length,
        data: posts,
      });
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      return res.status(500).json({ msg: 'Server error fetching posts' });
    }
  }

  // --- POST Request (Create a new post) ---
  if (req.method === 'POST') {
    // 1. Security Check (Only admin can post)
    const SUPER_SECRET_PASSWORD = "jukanesadmin123";
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== `Bearer ${SUPER_SECRET_PASSWORD}`) {
      return res.status(401).json({ msg: 'Unauthorized: Access Denied' });
    }

    // 2. Get data from request body
    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: 'Please provide a title and content.' });
    }

    try {
      // 3. Create a new post
      const newPost = new Post({
        title,
        slug: slugify(title), // Create a URL-friendly slug
        content,
        imageUrl: imageUrl || '', // Handle optional image
      });

      // 4. Save to database
      await newPost.save();
      
      console.log('Post saved:', newPost);
      return res.status(201).json({ msg: 'Post created successfully!', data: newPost });
    } catch (err) {
      // This will catch errors, e.g., if the title/slug is not unique
      console.error('Error saving post:', err.message);
      if (err.code === 11000) { // Duplicate key error
        return res.status(400).json({ msg: 'Error: A post with this title already exists.' });
      }
      return res.status(500).json({ msg: 'Server error saving post' });
    }
  }
  
  // Handle any other methods
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
};

export default handler;