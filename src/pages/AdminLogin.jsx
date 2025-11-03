import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // 1. Import Firebase
import { auth } from '../firebaseConfig'; // 2. Import your auth config
import { FaSpinner } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- Handle Login ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      // 3. Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Success! The ProtectedRoute will now let you in.
      navigate('/admin/dashboard');
    } catch (err) {
      // Handle Firebase errors
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error("Firebase login error:", err.code, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Forgot Password ---
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError('Failed to send reset email. Please check the email address.');
      console.error("Password reset error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // JUKANES Brand Styling
    <div className="flex items-center justify-center min-h-screen bg-[#fffacd]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-lg">
        <img
          src="/img/logo.png" // Path to your logo
          alt="JUKANES Association Logo"
          className="w-32 h-auto mx-auto"
        />
        <h1 className="text-3xl font-bold text-center font-heading text-[#2e4057]">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2e4057]">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] text-[#2e4057]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2e4057]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] text-[#2e4057]"
            />
          </div>

          {/* Error & Success Messages */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 flex justify-center items-center"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : 'Login'}
            </button>
          </div>
          <div className="text-sm text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="font-medium text-[#20a39e] hover:text-[#1a8a86]"
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;