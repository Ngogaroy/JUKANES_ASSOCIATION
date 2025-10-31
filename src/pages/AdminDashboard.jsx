import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Your secret password

  useEffect(() => {
    // 1. Security Check
    const auth = sessionStorage.getItem('jukanes-admin-auth');
    if (auth !== 'true') {
      navigate('/admin-login');
      return;
    }

    // 2. Data Fetching
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- Fetch Donations ---
        const donationsRes = await fetch('/api/donations', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}` }
        });
        if (!donationsRes.ok) {
          const errData = await donationsRes.json();
          throw new Error(`Failed to fetch donations: ${errData.msg || donationsRes.statusText}`);
        }
        const donationsResult = await donationsRes.json();
        setDonations(donationsResult.data);

        // --- Fetch Contacts ---
        const contactsRes = await fetch('/api/contacts', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}` }
        });
        if (!contactsRes.ok) {
           const errData = await contactsRes.json();
          throw new Error(`Failed to fetch contacts: ${errData.msg || contactsRes.statusText}`);
        }
        const contactsResult = await contactsRes.json();
        setContacts(contactsResult.data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('jukanes-admin-auth');
    navigate('/admin-login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
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
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
            <span className="ml-4 text-lg text-[#797e88]">Loading Data...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="p-4 mb-4 text-center text-red-700 bg-red-100 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* --- Donation Table --- */}
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
          </div>
        )}
        
        {/* --- Contact Messages Table --- */}
        {!isLoading && !error && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
              Contact Messages
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">{formatDate(contact.submittedAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4057]">{contact.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">{contact.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2e4057]">{contact.subject}</td>
                        <td className="px-6 py-4 text-sm text-[#797e88] whitespace-pre-wrap max-w-sm">{contact.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-[#797e88]">No contact messages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;