import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe and get secrets
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from webhook)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Model ---
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true }, // Added currency
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String },
  mpesaCheckoutRequestID: { type: String }, // Added M-Pesa ID
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

// --- CORS Helper (NEW) ---
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000', // For vercel dev
    'https://jukaneswebsite.vercel.app' // YOUR LIVE VERCEL URL (add custom domains later)
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature'); // Added Stripe-Signature
};

// --- Webhook Handler Config ---
export const config = {
  api: {
    bodyParser: false, // We need the raw body for Stripe
  },
};

// Function to buffer the raw request stream
const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
};

const handler = async (req, res) => {
  // *** ADDED CORS CALL (req, res) ***
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const reqBuffer = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  // 1. Verify the event came from Stripe
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent Succeeded:', paymentIntent.id);

      try {
        await connectDB();
        
        // 3. Find and update the donation status
        const donation = await Donation.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { status: 'Succeeded' },
          { new: true }
        );

        if (donation) {
          console.log('Donation status updated to "Succeeded" for:', donation.email);
        } else {
          console.warn(`Webhook received for unknown PaymentIntent: ${paymentIntent.id}`);
        }
        
      } catch (err) {
        console.error('Error updating donation in DB:', err.message);
      }
      break;

    case 'payment_intent.payment_failed':
      // ... (handle failed payments) ...
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // 5. Send a 200 OK response back to Stripe
  res.status(200).json({ received: true });
};

export default handler;