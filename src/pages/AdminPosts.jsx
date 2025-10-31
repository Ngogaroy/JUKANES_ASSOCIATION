import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpinner, FaPlus } from 'react-icons/fa';

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the "New Post" form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const SUPER_SECRET_PASSWORD = "jukanesadmin123"; // Must match login

  // --- 1. Fetch Existing Posts ---
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // We don't need auth to GET posts (public blog)
      const response = await fetch('/api/posts'); 
      if (!response.ok) throw new Error('Failed to fetch posts');
      const result = await response.json();
      setPosts(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Security Check & Initial Fetch ---
  useEffect(() => {
    const auth = sessionStorage.getItem('jukanes-admin-auth');
    if (auth !== 'true') {
      navigate('/admin-login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  // --- 3. Handle New Post Submission ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPER_SECRET_PASSWORD}` // Send auth password
        },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        alert('Post created successfully!');
        setTitle('');
        setContent('');
        setImageUrl('');
        fetchPosts(); // Refresh the post list
      } else {
        // Handle API errors (like "duplicate title")
        setFormError(result.msg || 'An error occurred.');
      }
    } catch (err) {
      setFormError('An error occurred. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Reusable styles
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] focus:border-transparent placeholder-gray-500 text-[#2e4057]";
  const labelClasses = "block text-sm font-medium text-[#2e4057] mb-1";

  return (
    <div className="space-y-8">
      {/* --- Section 1: Create New Post --- */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          Create New Post
        </h2>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClasses}>Post Title</label>
            <input
              type="text" id="title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses} placeholder="Your blog post title" required
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className={labelClasses}>Cover Image URL (Optional)</label>
            <input
              type="text" id="imageUrl" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClasses} placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="content" className={labelClasses}>Content (Markdown enabled)</label>
            <textarea
              id="content" value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8" className={`${inputClasses} resize-y`}
              placeholder="Write your post content here..." required
            ></textarea>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              Publish Post
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      </div>

      {/* --- Section 2: Manage Existing Posts --- */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          Manage Posts
        </h2>

        {isLoading && <div className="flex justify-center p-12"><FaSpinner className="animate-spin text-4xl text-[#20a39e]" /></div>}
        {error && <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg"><strong>Error:</strong> {error}</div>}

        {/* Posts Table */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase dark:text-neutral-400">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase dark:text-neutral-400">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase dark:text-neutral-400">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4057] dark:text-neutral-200">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88] dark:text-neutral-400">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88] dark:text-neutral-400">/blog/{post.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/blog/${post.slug}`} className="text-[#20a39e] hover:text-[#1a8a86]" target="_blank" rel="noopener noreferrer">View</Link>
                        {/* We will add Edit/Delete functions later */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-[#797e88] dark:text-neutral-400">No posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;