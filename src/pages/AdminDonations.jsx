import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const AdminDonations = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      navigate('/admin-login');
      return;
    }

    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/donations', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
           const errData = await response.json();
           throw new Error(`Failed to fetch donations: ${errData.msg || response.statusText}`);
        }
        const result = await response.json();
        setDonations(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [navigate, currentUser, authLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  return (
    // Removed dark mode classes
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
        Donation Records
      </h2>
      
      {error && (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'Succeeded' ? 'bg-green-100 text-green-800' : 
                        donation.status === 'Pending M-Pesa' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
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