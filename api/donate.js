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

// --- Database Schema (Updated) ---
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true, default: 'usd' }, // <-- Set default to USD
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

// --- CORS Helper ---
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(res);
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

  // --- CURRENCY UPDATE ---
  // Charge in USD. 1 USD = 100 cents.
  const amountInCents = Math.round(parseFloat(amount) * 100);
  const currency = 'usd'; // <-- CHARGE IN USD

  if (isNaN(amountInCents) || amountInCents < 50) { // Stripe minimum $0.50 USD
    return res.status(400).json({ msg: 'Invalid amount' });
  }
  // --- END CURRENCY UPDATE ---

  try {
    // --- STRIPE UPDATE ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency, // <-- Use USD
      receipt_email: email,
      metadata: { name },
      payment_method_types: ['card'], // Only allow card for this USD endpoint
    });
    // --- END STRIPE UPDATE ---

    const newDonation = new Donation({
      name,
      email,
      amount,
      currency: currency, // <-- Save USD to DB
      stripePaymentIntentId: paymentIntent.id,
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