import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const AdminContacts = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      navigate('/admin-login');
      return;
    }

    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/contacts', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(`Failed to fetch contact messages: ${errData.msg || response.statusText}`);
        }
        const result = await response.json();
        setContacts(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
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
        Contact Form Messages
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
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
      )}
    </div>
  );
};

export default AdminContacts;