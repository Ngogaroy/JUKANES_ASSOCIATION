import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Must match login

  useEffect(() => {
    // 1. Security Check
    const auth = sessionStorage.getItem('jukanes-admin-auth');
    if (auth !== 'true') {
      navigate('/admin-login');
      return;
    }

    // 2. Data Fetching
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/contacts', { // Fetches from /api/contacts
          method: 'GET',
          headers: { 'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}` }
        });
        if (!response.ok) throw new Error('Failed to fetch contact messages');
        const result = await response.json();
        setContacts(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [navigate]);

  // Helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
        Contact Form Messages
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

      {/* 3. --- Contact Messages Table --- */}
      {!isLoading && !error && (
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
                    {/* Use whitespace-pre-wrap to respect line breaks in the message */}
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
      )}
    </div>
  );
};

export default AdminContacts;