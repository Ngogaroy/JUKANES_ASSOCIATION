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
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

  // The STK Push callback payload
  const callbackData = req.body.Body.stkCallback;
  
  // Send a success response to Safaricom immediately
  // Safaricom doesn't wait for your database logic, it just needs a quick "OK"
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

  // --- Process the Callback Asynchronously ---
  try {
    await connectDB();

    const resultCode = callbackData.ResultCode;
    const checkoutRequestID = callbackData.CheckoutRequestID;
    
    let newStatus = 'Failed'; // Default to Failed
    
    if (resultCode === 0) {
      // Payment was successful
      newStatus = 'Succeeded';
      console.log(`Payment Succeeded for CheckoutID: ${checkoutRequestID}`);
      
      // You can extract more details if needed
      // const amount = callbackData.CallbackMetadata.Item.find(i => i.Name === 'Amount').Value;
      // const mpesaReceipt = callbackData.CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber').Value;
      // const phone = callbackData.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber').Value;

    } else {
      // Payment failed or was cancelled
      newStatus = 'Failed M-Pesa';
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