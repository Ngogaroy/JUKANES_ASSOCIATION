import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaSave, FaArrowLeft } from 'react-icons/fa';

const AdminEditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Gets the post ID from the URL
  const { currentUser, loading: authLoading } = useAuth();
  
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 1. Fetch the single post's data on page load
  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      navigate('/admin-login');
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`/api/posts?id=${id}`, { // Use the new API query
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch post data.');
        
        const result = await response.json();
        setPost(result.data);
        // Pre-fill the form fields
        setTitle(result.data.title);
        setContent(result.data.content);
        setImageUrl(result.data.imageUrl || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser, authLoading, navigate]);

  // 2. Handle the "Update" form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/posts', {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, title, content, imageUrl }), // Send the ID back
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Post updated successfully!');
      } else {
        setError(result.msg || 'An error occurred.');
      }
    } catch (err) {
      setError('An error occurred. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Styles ---
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] text-[#2e4057]";
  const labelClasses = "block text-sm font-medium text-[#2e4057] mb-1";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/posts" className="inline-flex items-center gap-2 text-[#20a39e] hover:text-[#1a8a86] font-semibold">
        <FaArrowLeft />
        Back to All Posts
      </Link>

      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          Edit Post
        </h2>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {message && <p className="text-sm text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClasses}>Post Title</label>
            <input
              type="text" id="title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses} required
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className={labelClasses}>Cover Image URL (Optional)</label>
            <input
              type="text" id="imageUrl" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="content" className={labelClasses}>Content</label>
            <textarea
              id="content" value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12" className={`${inputClasses} resize-y`} required
            ></textarea>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#ffc72c] text-[#2e4057] font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditPost;