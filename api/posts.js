import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authAdmin } from '../lib/firebaseAdmin.js';

// No dotenv.config() needed, Vercel handles it

// --- Database Connection ---
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
};

// --- Database Schema ---
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
  const allowedOrigins = ['http://localhost:3000', 'https://jukaneswebsite.vercel.app'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Slugify Function ---
const slugify = (str) => {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

// --- Token Verification ---
const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    req.user = decodedToken;
    return true;
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};

// --- Main Handler ---
export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({ msg: 'Database connection failed' });
  }

  // --- PUBLIC: GET Request (Fetch all posts OR a single post) ---
  if (req.method === 'GET') {
    try {
      // 1. --- NEW: Check if a specific post ID is requested ---
      const { id } = req.query;
      if (id) {
        // This is for the admin "Edit" page
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(200).json({ msg: 'Post fetched successfully', data: post });
      }
      // --- End of new code ---

      // This is for the public blog page
      const posts = await Post.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ msg: 'Posts fetched', data: posts });
    } catch (err) {
      console.error('Error fetching post(s):', err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }

  // --- All other methods are ADMIN-ONLY ---
  const isVerified = await verifyToken(req, res);
  if (isVerified !== true) return; // Stop if not authorized

  // --- ADMIN: POST Request (Create new) ---
  if (req.method === 'POST') {
    // ... (POST logic remains the same) ...
  }

  // --- ADMIN: PUT Request (Update existing) ---
  if (req.method === 'PUT') {
    // ... (PUT logic remains the same) ...
  }

  // --- ADMIN: DELETE Request (Delete post) ---
  if (req.method === 'DELETE') {
    // ... (DELETE logic remains the same) ...
  }
  
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE, OPTIONS']);
  return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
};