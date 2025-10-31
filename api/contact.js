import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Resend } from 'resend'; // 1. Import Resend

dotenv.config();

// 2. Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from contact)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed'); 
  }
};

// --- Database Schema ---
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
    'http://localhost:3000',
    'https://jukaneswebsite.vercel.app'
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res); 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // 3. --- Save to Database (First Task) ---
    await connectDB();
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    console.log('Contact saved to MongoDB:', newContact);

    // 4. --- Send Email (Second Task) ---
    await resend.emails.send({
      // NOTE: Resend's free plan requires emails to come from a verified domain.
      // For now, use their "onboarding" address as a placeholder.
      // You must verify your 'jukanesassociation@gmail.com' in Resend to use it as 'to'.
      from: 'onboarding@resend.dev', 
      to: 'jukanessassociation@gmail.com', // Your email
      subject: `New JUKANES Contact Form: ${subject}`,
      html: `
        <div>
          <h2>New Message from JUKANES Website</h2>
          <p>You have received a new contact form submission.</p>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
    console.log('Email notification sent via Resend.');

    // 5. --- Send Success Response ---
    return res.status(201).json({ msg: 'Message received successfully!' });

  } catch (err) {
    console.error('Error in contact API:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export default handler;