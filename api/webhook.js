import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { Resend } from 'resend'; // 1. Import Resend

dotenv.config();

// 2. Initialize Resend and Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');
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

// --- Main Handler ---
const handler = async (req, res) => {
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

  // 2. Handle the 'payment_intent.succeeded' event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('PaymentIntent Succeeded:', paymentIntent.id);

    try {
      await connectDB();
      
      // 3. Find the donation in our DB
      const donation = await Donation.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'Succeeded' },
        { new: true } // Return the updated document
      );

      if (donation) {
        console.log('Donation status updated to "Succeeded" for:', donation.email);
        
        // 4. --- SEND THANK YOU EMAIL ---
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev', // Use Resend's required "from"
            to: donation.email, // The donor's email from the DB record
            subject: 'Thank you for your donation to JUKANES Association!',
            html: `
              <div>
                <h1>Thank You, ${donation.name}!</h1>
                <p>We've successfully received your generous donation of <strong>${donation.amount} ${donation.currency.toUpperCase()}</strong>.</p>
                <p>Your support helps us continue our mission to restore hope, love, and belonging to vulnerable individuals. We truly couldn't do this without you.</p>
                <p>We keep you smiling!</p>
                <br>
                <p>With gratitude,</p>
                <p>The JUKANES Association Family</p>
              </div>
            `,
          });
          console.log('Donor confirmation email sent to:', donation.email);
        } catch (emailError) {
          console.error('Error sending donor email:', emailError.message);
          // Don't block the webhook, just log the error
        }
        // --- END OF EMAIL ---

      } else {
        console.warn(`Webhook received for unknown PaymentIntent: ${paymentIntent.id}`);
      }
      
    } catch (err) {
      console.error('Error in payment_intent.succeeded handler:', err.message);
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  // 5. Send a 200 OK response back to Stripe
  res.status(200).json({ received: true });
};

export default handler;