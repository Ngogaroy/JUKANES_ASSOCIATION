import React, { useState, useEffect } from 'react'; // <-- 1. Imported useEffect
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { FaInfoCircle } from 'react-icons/fa'; // <-- 2. Imported FaInfoCircle

// Load Stripe outside the component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Donate = () => {
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('10'); // Default amount in USD
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mpesaPhone, setMpesaPhone] = useState('');

  // Flow Control
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Update 'amount' if 'customAmount' changes
  useEffect(() => {
    if (customAmount) {
      setAmount(customAmount);
    }
  }, [customAmount]);

  // Handle radio button clicks for preset amounts
  const handleAmountClick = (value) => {
    setCustomAmount(''); // Clear custom amount
    setAmount(value);
  };
  
  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) { 
      setAmount(value);
    } else {
      setAmount('10'); // Default back to $10 if empty
    }
  };

  // Main submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMsg(null);
    setClientSecret(null);

    if (paymentMethod === 'card') {
      // --- Stripe (Card) Flow ---
      try {
        const response = await fetch('/api/donate', { // Calls our Stripe API
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, amount }), // API expects USD
        });
        const result = await response.json();
        if (response.ok) {
          setClientSecret(result.clientSecret); 
          setResponseMsg({ type: 'success', text: 'Please enter card details.' });
        } else {
          setResponseMsg({ type: 'error', text: result.msg || 'Error. Try again.' });
        }
      } catch (error) {
        setResponseMsg({ type: 'error', text: 'An error occurred. Check connection.' });
      } finally {
        setIsLoading(false);
      }

    } else if (paymentMethod === 'mpesa') {
      // --- M-Pesa Flow ---
      setResponseMsg({ type: 'info', text: 'M-Pesa STK Push coming soon...' });
      console.log('Submitting to M-Pesa:', { name, email, amount, mpesaPhone });
      // We will build the /api/mpesa-stk-push endpoint next
      setIsLoading(false); 

    } else if (paymentMethod === 'other') {
      setIsLoading(false);
    }
  };

  // --- Styles ---
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] focus:border-transparent placeholder-gray-500 text-[#2e4057]";
  const radioLabelBase = "px-4 py-2 border border-gray-300 cursor-pointer transition-colors duration-200 rounded text-center font-medium";
  const radioLabelChecked = "bg-[#2e4057] text-white border-[#2e4057]";
  const radioLabelUnchecked = "bg-[#fffacd] text-[#2e4057] hover:bg-opacity-75";

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mx-auto max-w-lg mb-12">
          <p className="font-heading text-[#ffc72c] font-semibold mb-2">Support Us</p>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">Make a Donation</h1>
          <p className="text-[#797e88]">Your contribution helps us keep smiles on vulnerable faces.</p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap overflow-hidden shadow-xl rounded-lg bg-white">
          {/* Text Section (Left) */}
          <div className="w-full lg:w-7/12 bg-[#fffacd] py-12 px-6 sm:px-10 lg:px-16 flex flex-col justify-center order-last lg:order-first">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-6 text-[#2e4057]">Your Support Restores Hope</h2>
            <p className="text-lg text-[#797e88] mb-4">Through your donations, we spread kindness...</p>
            <h3 className="text-xl font-semibold font-heading text-[#2e4057] mt-6 mb-3">Our Contribution Model</h3>
            <p className="text-[#797e88] text-sm"><b>25%</b> Member Savings | <b>50%</b> Direct Donations | <b>25%</b> Sustainability Projects</p>
          </div>

          {/* Form Section (Right) */}
          <div className="w-full lg:w-5/12 bg-[#ffc72c] py-12 px-6 sm:px-10 lg:p-16">
            
            {/* --- Step 1: Info Form --- */}
            {!clientSecret && (
              <form onSubmit={handleSubmit} className="text-center">
                <h2 className="text-3xl font-heading font-bold text-[#2e4057] mb-8">Choose Your Impact</h2>
                <div className="grid grid-cols-1 gap-y-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="donate-name" className="sr-only">Your Name</label>
                    <input type="text" id="donate-name" name="name" placeholder="Your Name"
                           className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  {/* Email Input */}
                  <div>
                    <label htmlFor="donate-email" className="sr-only">Your Email</label>
                    <input type="email" id="donate-email" name="email" placeholder="Your Email"
                           className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  
                  {/* --- UPDATED Amount Fields (USD) --- */}
                  <fieldset className="mt-2">
                    <legend className="text-sm font-medium text-left text-[#2e4057] mb-2">Select Amount (in USD)</legend>
                    <div className="flex flex-wrap justify-center gap-3" role="radiogroup">
                      {['10', '20', '30', '50'].map((value) => (
                        <div key={value} className="flex-1 min-w-[60px]">
                          <input type="radio" className="sr-only peer" name="donationAmount"
                                 id={`amount${value}`} checked={amount === value && !customAmount}
                                 onChange={() => handleAmountClick(value)} value={value}
                          />
                          <label
                            htmlFor={`amount${value}`}
                            className={`${radioLabelBase} ${amount === value && !customAmount ? radioLabelChecked : radioLabelUnchecked} block peer-focus:ring-2 peer-focus:ring-[#20a39e]`}
                          >
                            ${value}
                          </label>
                        </div>
                      ))}
                    </div>
                    {/* Custom Amount */}
                    <div className="mt-4">
                      <label htmlFor="custom-amount" className="sr-only">Custom Amount (USD)</label>
                      <input
                        type="number" id="custom-amount" name="customAmount"
                        placeholder="Or Enter Amount (USD)"
                        className={inputClasses}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                      />
                    </div>
                  </fieldset>
                  
                  {/* --- Payment Method --- */}
                  <fieldset className="mt-2">
                    <legend className="text-sm font-medium text-left text-[#2e4057] mb-2">Payment Method</legend>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-[#fffacd] rounded">
                        <input id="pay-card" name="paymentMethod" type="radio"
                               checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}
                               className="h-4 w-4 text-[#20a39e] focus:ring-[#20a39e] border-gray-300" />
                        <label htmlFor="pay-card" className="ml-3 block text-sm font-medium text-[#2e4057]">Credit/Debit Card (USD)</label>
                      </div>
                      <div className="flex items-center p-3 bg-[#fffacd] rounded">
                        <input id="pay-mpesa" name="paymentMethod" type="radio"
                               checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')}
                               className="h-4 w-4 text-[#20a39e] focus:ring-[#20a39e] border-gray-300" />
                        <label htmlFor="pay-mpesa" className="ml-3 block text-sm font-medium text-[#2e4057]">M-Pesa (KES)</label>
                      </div>
                      <div className="flex items-center p-3 bg-[#fffacd] rounded">
                        <input id="pay-other" name="paymentMethod" type="radio"
                               checked={paymentMethod === 'other'} onChange={() => setPaymentMethod('other')}
                               className="h-4 w-4 text-[#20a39e] focus:ring-[#20a39e] border-gray-300" />
                        <label htmlFor="pay-other" className="ml-3 block text-sm font-medium text-[#2e4057]">Other (Sendwave, Bank Transfer)</label>
                      </div>
                    </div>
                  </fieldset>

                  {/* Conditional M-Pesa Phone Field */}
                  {paymentMethod === 'mpesa' && (
                    <div>
                      <label htmlFor="mpesa-phone" className="sr-only">M-Pesa Phone Number</label>
                      <input type="tel" id="mpesa-phone" name="mpesaPhone"
                             placeholder="M-Pesa Phone (e.g., 2547...)"
                             className={inputClasses} value={mpesaPhone}
                             onChange={(e) => setMpesaPhone(e.target.value)} required={paymentMethod === 'mpesa'} />
                    </div>
                  )}

                  {/* Conditional "Other Methods" Info Box */}
                  {paymentMethod === 'other' && (
                    <div className="text-left p-4 bg-[#fffacd] rounded border border-[#2e4057]">
                       <h4 className="font-semibold font-heading text-[#2e4057] mb-2 flex items-center"><FaInfoCircle className="mr-2" /> Manual Donation Instructions</h4>
                       <p className="text-sm text-[#2e4057] mb-2">Please use your preferred service (Sendwave, WorldRemit, Bank) to send your donation to:</p>
                       <ul className="list-disc list-inside text-sm text-[#2e4057] space-y-1">
                         <li><strong>Method:</strong> M-Pesa (Mobile Money)</li>
                         <li><strong>Name:</strong> JUKANES Association</li>
                         <li><strong>Phone:</strong> +254 7XX XXX XXX</li> {/* TODO: Add real phone number */}
                       </ul>
                    </div>
                  )}
                  
                  {/* Submit Button (Hidden for 'Other') */}
                  {paymentMethod !== 'other' && (
                    <div>
                      <button type="submit" disabled={isLoading}
                              className="w-full bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#20a39e] focus:ring-offset-2 focus:ring-offset-[#ffc72c] disabled:opacity-50">
                        {isLoading ? 'Processing...' : (paymentMethod === 'card' ? 'Proceed to Card Payment' : 'Donate with M-Pesa')}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
            
            {/* --- Step 2: Stripe Card Form --- */}
            {clientSecret && paymentMethod === 'card' && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )}

            {/* Response Message Area */}
            {responseMsg && (
              <div className={`text-sm mt-4 font-semibold ${
                responseMsg.type === 'success' ? 'text-green-800' :
                responseMsg.type === 'error' ? 'text-red-700' :
                'text-[#2e4057]' // Info color
              }`}>
                {responseMsg.text}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;