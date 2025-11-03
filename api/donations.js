import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authAdmin } from '../lib/firebaseAdmin.js'; // <-- THIS IS THE FIX

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from api/donations)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (Unified) ---
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String },
  mpesaCheckoutRequestID: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

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
    console.error('Firebase token verification error:', error.message);
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  const isVerified = await verifyToken(req, res);
  if (isVerified !== true) return;

  console.log('Access granted for user:', req.user.email);

  try {
    await connectDB();
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      msg: 'Donations fetched successfully',
      data: donations,
    });
  } catch (err) {
    console.error('Error fetching donations:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export default handler;