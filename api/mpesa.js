import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

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

// --- Database Schema ---
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
    'http://localhost:3000', // For vercel dev
    'https://jukaneswebsite.vercel.app' // YOUR LIVE VERCEL URL
    // Add your custom domain here later, e.g., 'https://www.jukanes.org'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- M-Pesa Helper Functions ---
// 1. Get Auth Token
const getMpesaAuthToken = async () => {
  const auth = Buffer.from(`${mpesaConsumerKey}:${mpesaConsumerSecret}`).toString('base64');
  try {
    const response = await axios.get(mpesaAuthUrl, {
      headers: { Authorization: `Basic ${auth}` },
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
  // Adjust for EAT (East Africa Time, GMT+3)
  // Vercel servers run on UTC.
  const offset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const eatDate = new Date(date.getTime() + offset);

  const year = eatDate.getFullYear();
  const month = (eatDate.getMonth() + 1).toString().padStart(2, '0');
  const day = eatDate.getDate().toString().padStart(2, '0');
  const hours = eatDate.getHours().toString().padStart(2, '0');
  const minutes = eatDate.getMinutes().toString().padStart(2, '0');
  const seconds = eatDate.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// --- Main Handler ---
const handler = async (req, res) => {
  // *** CORRECTION 1: Pass 'req' to the CORS function ***
  setCorsHeaders(req, res); 

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

  let formattedPhone = mpesaPhone.trim();
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1);
  }
  if (!formattedPhone.startsWith('254') || formattedPhone.length < 12) {
    return res.status(400).json({ msg: 'Invalid phone number. Use 254... format.' });
  }

  const amountAsInt = Math.round(parseFloat(amount));
  if (isNaN(amountAsInt) || amountAsInt < 1) {
    return res.status(400).json({ msg: 'Invalid amount for M-Pesa' });
  }

  // --- 2. M-Pesa STK Push Steps ---
  try {
    const token = await getMpesaAuthToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(
      `${mpesaShortCode}${mpesaPasskey}${timestamp}`
    ).toString('base64');

    // *** CORRECTION 2: Removed extra slashes from URL ***
    const callBackURL = `https://jukaneswebsite.vercel.app/api/mpesa-callback`;
    
    const stkPushResponse = await axios.post(
      mpesaStkPushUrl,
      {
        BusinessShortCode: mpesaShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amountAsInt,
        PartyA: formattedPhone,
        PartyB: mpesaShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callBackURL,
        AccountReference: 'JUKANES Donation',
        TransactionDesc: 'Donation to JUKANES',
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
      // STK Push was successfully *sent*
      const newDonation = new Donation({
        name,
        email,
        amount: amountAsInt.toString(),
        currency: 'kes',
        status: 'Pending M-Pesa',
        mpesaCheckoutRequestID: CheckoutRequestID,
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