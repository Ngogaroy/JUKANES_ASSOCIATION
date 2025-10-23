import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// This is the actual card entry form
const CheckoutForm = () => {
  const stripe = useStripe(); // Hook to access Stripe
  const elements = useElements(); // Hook to access form elements

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // 1. Trigger form validation and gather data
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    // 2. Confirm the payment with Stripe using the clientSecret
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // This is the URL Stripe will redirect to after payment
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // 3. This point is only reached if there's an immediate error
    // (e.g., card declined). Otherwise, the user is redirected.
    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-heading font-semibold text-[#2e4057]">Complete Your Donation</h3>
      <p className="text-sm text-[#797e88]">Enter your card details below. We do not store your card information.</p>
      
      {/* This component renders the secure card number, expiry, and CVC fields */}
      <PaymentElement />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#20a39e] focus:ring-offset-2 focus:ring-offset-[#ffc72c] disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>

      {/* Show any error messages */}
      {errorMessage && <div className="text-sm font-semibold text-red-700">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;