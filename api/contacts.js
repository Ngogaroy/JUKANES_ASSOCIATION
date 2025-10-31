import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from api/contacts)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (from api/contact.js) ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

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
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  // --- Simple Security Check ---
  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Must match AdminDashboard.jsx
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${SUPER_SECRET_PASSWORD}`) {
    return res.status(401).json({ msg: 'Unauthorized: Access Denied' });
  }
  // --- End Security Check ---

  try {
    await connectDB();

    // --- Fetch contact messages ---
    const contacts = await Contact.find({}).sort({ submittedAt: -1 });

    // Send the data back
    return res.status(200).json({
      msg: 'Contacts fetched successfully',
      count: contacts.length,
      data: contacts,
    });

  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export default handler;