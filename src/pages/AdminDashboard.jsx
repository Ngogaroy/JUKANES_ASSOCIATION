import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // For loading icon

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]); // State to hold donation data
  const [contacts, setContacts] = useState([]); // State for contact messages (for later)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This `useEffect` hook runs when the page loads
  useEffect(() => {
    // 1. --- Security Check ---
    // Get the "auth token" we saved in session storage on the login page
    const auth = sessionStorage.getItem('jukanes-admin-auth');
    // This is the same hardcoded password from the login page
    const SUPER_SECRET_PASSWORD = "jukanesadmin123"; 

    if (auth !== 'true') {
      // If the user is not "logged in", send them back to the login page
      navigate('/admin-login');
      return; // Stop running the rest of the code
    }

    // 2. --- Data Fetching ---
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data from our new API endpoint
        const response = await fetch('/api/donations', {
          method: 'GET',
          headers: {
            // 3. Send the secret password in the Authorization header
            'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}`
          }
        });

        if (!response.ok) {
          // If the API sends an error (like 401 Unauthorized)
          throw new Error('Failed to fetch data. Check credentials.');
        }

        const result = await response.json();
        setDonations(result.data); // Save the donation data in our state
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchDonations();
    // TODO: We will add fetchContacts() here later

  }, [navigate]); // Dependency array

  const handleLogout = () => {
    sessionStorage.removeItem('jukanes-admin-auth');
    navigate('/admin-login');
  };

  // Helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold font-heading text-[#2e4057]">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[#2e4057] hover:text-[#ff6b6b]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
            <span className="ml-4 text-lg text-[#797e88]">Loading Data...</span>
          </div>
        )}
        {error && (
          <div className="p-4 mb-4 text-center text-red-700 bg-red-100 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 4. --- Donation Table --- */}
        {!isLoading && !error && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
              Donation Records
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.length > 0 ? (
                    donations.map((donation) => (
                      <tr key={donation._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {donation.status === 'Succeeded' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Succeeded
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {donation.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">
                          {formatDate(donation.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4057]">
                          {donation.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">
                          {donation.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2e4057]">
                          {donation.amount} {donation.currency.toUpperCase()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-[#797e88]">No donations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* We will add the Contact Messages table here later */}

      </main>
    </div>
  );
};

export default AdminDashboard;