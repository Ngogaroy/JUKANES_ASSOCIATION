import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Resend } from 'resend'; // 1. Import Resend

dotenv.config();

// 2. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// --- Main Handler ---
const handler = async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: `Method ${req.method} Not Allowed` });
  }

  console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

  if (!req.body || !req.body.Body || !req.body.Body.stkCallback) {
    console.warn('Invalid M-Pesa callback format received.');
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
    
    let newStatus = 'Failed M-Pesa';
    let isSuccess = false;
    
    if (resultCode === 0) {
      newStatus = 'Succeeded';
      isSuccess = true;
      console.log(`Payment Succeeded for CheckoutID: ${checkoutRequestID}`);
    } else {
      console.log(`Payment Failed/Cancelled for CheckoutID: ${checkoutRequestID}. Reason: ${callbackData.ResultDesc}`);
    }

    // Find the donation and update its status
    const updatedDonation = await Donation.findOneAndUpdate(
      { mpesaCheckoutRequestID: checkoutRequestID },
      { status: newStatus },
      { new: true }
    );
    
    // 3. --- SEND EMAIL IF SUCCESSFUL ---
    if (updatedDonation && isSuccess) {
        console.log(`Donation status updated to "Succeeded" for ID: ${checkoutRequestID}`);

        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev', // Use Resend's required "from"
            to: updatedDonation.email, // The donor's email from the DB record
            subject: 'Thank you for your donation to JUKANES Association!',
            html: `
              <div>
                <h1>Thank You, ${updatedDonation.name}!</h1>
                <p>We've successfully received your generous M-Pesa donation of <strong>${updatedDonation.amount} ${updatedDonation.currency.toUpperCase()}</strong>.</p>
                <p>Your support helps us continue our mission to restore hope, love, and belonging to vulnerable individuals. We truly couldn't do this without you.</p>
                <p>We keep you smiling!</p>
                <br>
                <p>With gratitude,</p>
                <p>The JUKANES Association Family</p>
              </div>
            `,
          });
          console.log('Donor confirmation email sent to:', updatedDonation.email);
        } catch (emailError) {
          console.error('Error sending donor email:', emailError.message);
        }
        // --- END OF EMAIL ---
        
    } else if (!updatedDonation) {
        console.warn(`Callback received for unknown CheckoutID: ${checkoutRequestID}`);
    }

  } catch (err) {
    console.error('Error processing M-Pesa callback:', err.message);
  }
};

export default handler;