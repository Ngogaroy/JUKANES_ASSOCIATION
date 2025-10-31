import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
// This schema must match the one you use in api/donate.js
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
    'http://localhost:3000', // For vercel dev
    'https://jukaneswebsite.vercel.app' // YOUR LIVE VERCEL URL
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Only allow GET
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // We will use Authorization
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. We only want to respond to GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  // 2. --- Simple Security Check ---
  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Must match AdminDashboard.jsx
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${SUPER_SECRET_PASSWORD}`) {
    return res.status(401).json({ msg: 'Unauthorized: Access Denied' });
  }
  // --- End Security Check ---

  try {
    await connectDB();

    // 3. Fetch donations from MongoDB
    const donations = await Donation.find({}).sort({ createdAt: -1 });

    // 4. Send the data back as JSON
    return res.status(200).json({
      msg: 'Donations fetched successfully',
      count: donations.length,
      data: donations,
    });

  } catch (err) {
    console.error('Error fetching donations:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export default handler;