import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authAdmin } from '../../lib/firebaseAdmin.js'; // Use our Firebase helper

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
};

// --- Import All Our Models ---
// We only need the models for data we're counting in MongoDB
import '../donations.js';
import '../contact.js';
import '../posts.js';
// We REMOVED the import for User.js

const Donation = mongoose.models.Donation;
const Contact = mongoose.models.Contact;
const Post = mongoose.models.Post;
// const User = mongoose.models.User; // REMOVED

// --- CORS Helper ---
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000', 'https://jukaneswebsite.vercel.app'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  // 1. Secure the endpoint
  const isVerified = await verifyToken(req, res);
  if (isVerified !== true) return;

  try {
    await connectDB();

    // 2. Run all database queries in parallel (REMOVED User count)
    const [
      totalDonations,
      totalContacts,
      totalPosts
    ] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'Succeeded' } },
        { $group: { _id: "$currency", total: { $sum: { $toInt: "$amount" } } } }
      ]),
      Contact.countDocuments(),
      Post.countDocuments()
    ]);

    // 3. Format the stats (REMOVED admins)
    const stats = {
      donations: totalDonations, 
      contacts: totalContacts,
      posts: totalPosts,
    };

    return res.status(200).json({ msg: 'Stats fetched successfully', data: stats });

  } catch (err) {
    console.error('Error fetching stats:', err.message);
    return res.status(500).json({ msg: 'Server error fetching stats' });
  }
}