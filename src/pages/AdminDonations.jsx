import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const AdminDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Must match login

  useEffect(() => {
    const auth = sessionStorage.getItem('jukanes-admin-auth');
    if (auth !== 'true') {
      navigate('/admin-login');
      return;
    }

    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/donations', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}` }
        });
        if (!response.ok) throw new Error('Failed to fetch donations');
        const result = await response.json();
        setDonations(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
        Donation Records
      </h2>

      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* --- Donation Table --- */}
      {!isLoading && !error && (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.status === 'Succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">{formatDate(donation.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4057]">{donation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">{donation.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2e4057]">{donation.amount} {donation.currency?.toUpperCase() || ''}</td>
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
      )}
    </div>
  );
};

export default AdminDonations;