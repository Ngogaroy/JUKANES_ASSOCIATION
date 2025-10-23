import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios'; // We're using axios to make API requests

dotenv.config();

// --- M-Pesa Credentials ---
const mpesaConsumerKey = process.env.MPESA_CONSUMER_KEY;
const mpesaConsumerSecret = process.env.MPESA_CONSUMER_SECRET;
const mpesaShortCode = process.env.MPESA_SHORTCODE;
const mpesaPasskey = process.env.MPESA_PASSKEY;

// Daraja API URLs (Sandbox)
const mpesaAuthUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const mpesaStkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected (from mpesa)...');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw new Error('Database connection failed');
  }
};

// --- Database Schema (Ensure it matches the one in api/donate.js) ---
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  stripePaymentIntentId: { type: String }, // For Stripe
  mpesaCheckoutRequestID: { type: String }, // For M-Pesa
  createdAt: { type: Date, default: Date.now },
});
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

// --- CORS Helper ---
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// --- M-Pesa Helper Functions ---
// 1. Get Auth Token
const getMpesaAuthToken = async () => {
  const auth = Buffer.from(`${mpesaConsumerKey}:${mpesaConsumerSecret}`).toString('base64');
  try {
    const response = await axios.get(mpesaAuthUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (err) {
    console.error('Error getting M-Pesa token:', err.response ? err.response.data : err.message);
    throw new Error('M-Pesa auth failed');
  }
};

// 2. Format Timestamp (YYYYMMDDHHMMSS)
const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({ msg: 'Database connection failed' });
  }

  const { name, email, amount, mpesaPhone } = req.body;

  // --- 1. Validation ---
  if (!name || !email || !amount || !mpesaPhone) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Ensure phone is in format 254...
  let formattedPhone = mpesaPhone.trim();
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1);
  }
  if (!formattedPhone.startsWith('254') || formattedPhone.length < 12) {
    return res.status(400).json({ msg: 'Invalid phone number. Use 254... format.' });
  }

  // Ensure amount is a whole number (M-Pesa doesn't use cents)
  const amountAsInt = Math.round(parseFloat(amount));
  if (isNaN(amountAsInt) || amountAsInt < 1) {
    return res.status(400).json({ msg: 'Invalid amount for M-Pesa' });
  }

  // --- 2. M-Pesa STK Push Steps ---
  try {
    // Step A: Get Auth Token
    const token = await getMpesaAuthToken();

    // Step B: Generate Timestamp and Password
    const timestamp = getTimestamp();
    const password = Buffer.from(
      `${mpesaShortCode}${mpesaPasskey}${timestamp}`
    ).toString('base64');

    // Step C: Make STK Push Request
    // IMPORTANT: Vercel gives you a unique URL. Use that for the CallBackURL.
    // For local dev, vercel dev's URL works. For production, you must register the live URL.
    const callBackURL = `https://YOUR_VERCEL_PROJECT_URL.vercel.app/api/mpesa-callback`;
    
    const stkPushResponse = await axios.post(
      mpesaStkPushUrl,
      {
        BusinessShortCode: mpesaShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', // Or 'CustomerBuyGoodsOnline'
        Amount: amountAsInt,
        PartyA: formattedPhone, // User's phone
        PartyB: mpesaShortCode, // Your paybill
        PhoneNumber: formattedPhone, // User's phone
        CallBackURL: callBackURL,
        AccountReference: 'JUKANES Donation', // Reference
        TransactionDesc: 'Donation to JUKANES', // Description
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Step D: Handle Successful Push Request
    const { CheckoutRequestID, ResponseCode, CustomerMessage } = stkPushResponse.data;

    if (ResponseCode === '0') {
      // STK Push was successfully *sent* (not *paid* yet)
      // Save a pending donation to our DB
      const newDonation = new Donation({
        name,
        email,
        amount: amountAsInt.toString(),
        currency: 'kes',
        status: 'Pending M-Pesa',
        mpesaCheckoutRequestID: CheckoutRequestID, // <-- Save this ID!
      });
      await newDonation.save();
      
      console.log('M-Pesa STK Push sent, pending user PIN:', CheckoutRequestID);
      return res.status(200).json({ msg: 'STK Push sent. Please enter your PIN on your phone.' });
    } else {
      // STK Push *failed to send*
      return res.status(400).json({ msg: CustomerMessage || 'Failed to send STK push.' });
    }

  } catch (err) {
    console.error('M-Pesa STK Push Error:', err.response ? err.response.data : err.message);
    return res.status(500).json({ msg: 'M-Pesa API error.' });
  }
};

export default handler;