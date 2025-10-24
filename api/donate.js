import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from donate)...');
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
  currency: { type: String, required: true }, // Will be 'usd' or 'kes'
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String }, // For Stripe
  mpesaCheckoutRequestID: { type: String }, // For M-Pesa
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({ msg: 'Database connection failed' });
  }

  const { name, email, amount } = req.body;

  if (!name || !email || !amount) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // --- Charge in USD ---
  const amountInCents = Math.round(parseFloat(amount) * 100);
  const currency = 'usd';

  if (isNaN(amountInCents) || amountInCents < 50) { // Stripe minimum $0.50 USD
    return res.status(400).json({ msg: 'Invalid amount' });
  }
  // --- END CURRENCY ---

  try {
    // --- Create Stripe Payment Intent ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      receipt_email: email,
      metadata: { name },
      payment_method_types: ['card'],
    });
    // --- END STRIPE ---

    // Save to DB
    const newDonation = new Donation({
      name,
      email,
      amount,
      currency: currency, // Save 'usd'
      stripePaymentIntentId: paymentIntent.id, // Save Stripe ID
      status: 'Incomplete',
    });
    await newDonation.save();

    return res.status(201).json({
      msg: 'Payment intent created.',
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Error creating payment intent:', err.message);
    return res.status(500).json({ msg: 'Server error creating payment' });
  }
};

export default handler;