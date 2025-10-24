import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from contact)...'); // Added location
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed'); 
  }
};

// --- Database Schema (The data structure) ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Create the model
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// --- CORS Helper (NEW) ---
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000', // For vercel dev
    'https://jukaneswebsite.vercel.app' // YOUR LIVE VERCEL URL
    // Add your custom domain here later
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Main Handler ---
const handler = async (req, res) => {
  // *** CORRECTION 1: Pass 'req' to the CORS function ***
  setCorsHeaders(req, res); 

  // 2. Handle browser's pre-flight "OPTIONS" request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Ensure DB is connected
  try {
    await connectDB();
  } catch (dbError) {
    console.error('DB Connection Error on request:', dbError.message);
    return res.status(500).json({ msg: 'Database connection failed' });
  }

  // 5. Handle the actual form submission
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
      
      console.log('Contact saved:', newContact);
      return res.status(201).json({ msg: 'Message received successfully!' });
    } catch (err) {
      console.error('Error saving contact:', err.message);
      return res.status(500).json({ msg: 'Server error saving contact' });
    }
  }
  
  // Handle any other methods (like GET)
  res.setHeader('Allow', ['POST', 'OPTIONS']);
  return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
};

export default handler;