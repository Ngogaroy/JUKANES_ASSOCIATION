import express from 'express';
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
// We need to re-define the model here so the webhook can use it
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String }, // This is the key we use to find the donation
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

// --- Webhook Handler ---
// Vercel's body-parser is disabled for webhooks, so we need to get the raw body
export const config = {
  api: {
    bodyParser: false,
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
  // We only care about POST requests
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
    // This event fires when the payment is fully successful
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent Succeeded:', paymentIntent.id);

      try {
        await connectDB();
        
        // 3. Find the donation in our database using the Payment Intent ID
        const donation = await Donation.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { status: 'Succeeded' }, // 4. Update its status
          { new: true } // Return the updated document
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

    // You can handle other events here, like 'payment_intent.payment_failed'
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log('PaymentIntent Failed:', paymentFailedIntent.id);
      // You could find the donation and update its status to "Failed"
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // 5. Send a 200 OK response back to Stripe
  res.status(200).json({ received: true });
};

export default handler;