import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from mpesa-callback)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (Must match the others) ---
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String },
  mpesaCheckoutRequestID: { type: String }, // This is the ID we use
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
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

  // Check if body and stkCallback exist
  if (!req.body || !req.body.Body || !req.body.Body.stkCallback) {
    console.warn('Invalid M-Pesa callback format received.');
    // Still send 200 to Safaricom to stop retries
    return res.status(200).json({ ResultCode: 1, ResultDesc: "Invalid format" }); 
  }

  const callbackData = req.body.Body.stkCallback;
  
  // Send a success response to Safaricom immediately
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

  // --- Process the Callback Asynchronously ---
  try {
    await connectDB();

    const resultCode = callbackData.ResultCode;
    const checkoutRequestID = callbackData.CheckoutRequestID;
    
    let newStatus = 'Failed M-Pesa'; // Default to Failed
    
    if (resultCode === 0) {
      // Payment was successful
      newStatus = 'Succeeded';
      console.log(`Payment Succeeded for CheckoutID: ${checkoutRequestID}`);
    } else {
      // Payment failed or was cancelled
      console.log(`Payment Failed/Cancelled for CheckoutID: ${checkoutRequestID}. Reason: ${callbackData.ResultDesc}`);
    }

    // Find the donation in our database using the CheckoutRequestID
    const updatedDonation = await Donation.findOneAndUpdate(
      { mpesaCheckoutRequestID: checkoutRequestID },
      { status: newStatus }, // Update its status
      { new: true } // Return the updated document
    );
    
    if (updatedDonation) {
        console.log(`Donation status updated to "${newStatus}" for ID: ${checkoutRequestID}`);
    } else {
        console.warn(`Callback received for unknown CheckoutID: ${checkoutRequestID}`);
    }

  } catch (err) {
    console.error('Error processing M-Pesa callback:', err.message);
    // We already sent a 200, so we just log the error
  }
};

export default handler;