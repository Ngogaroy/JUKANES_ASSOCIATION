import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // TODO: In a later step, we will replace this with a secure API call.
    // For now, we will use a simple hardcoded password.
    const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Change this!

    if (password === SUPER_SECRET_PASSWORD) {
      // If password is correct, "log in" the user by saving a token
      // in their browser's session storage.
      sessionStorage.setItem('jukanes-admin-auth', 'true');
      // Redirect to the dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center font-heading text-[#2e4057]">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-[#2e4057]"
            >
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

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;