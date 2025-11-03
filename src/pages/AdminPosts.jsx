import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import new icons

const AdminPosts = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // --- 1. Fetch Existing Posts ---
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
    if (authLoading) return;
    if (!currentUser) {
      navigate('/admin-login');
      return;
    }
    fetchPosts();
  }, [navigate, currentUser, authLoading]);

  // --- 3. Handle New Post Submission ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      const token = await currentUser.getIdToken(); 
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, imageUrl }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Post created successfully!');
        setTitle(''); setContent(''); setImageUrl('');
        fetchPosts(); // Refresh the post list
      } else {
        setFormError(result.msg || 'An error occurred.');
      }
    } catch (err) {
      setFormError('An error occurred. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. --- NEW: Handle Delete Post ---
  const handleDelete = async (postId, postTitle) => {
    // Show a confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the post "${postTitle}"?`)) {
      return; // Do nothing if user clicks "Cancel"
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: postId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Post deleted successfully!');
        fetchPosts(); // Refresh the post list
      } else {
        alert(`Error: ${result.msg || 'Failed to delete post.'}`);
      }
    } catch (err) {
      alert('An error occurred. Check connection.');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] text-[#2e4057]";
  const labelClasses = "block text-sm font-medium text-[#2e4057] mb-1";

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* --- Section 1: Create New Post --- */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          Create New Post
        </h2>
        {/* ... (Create Post Form) ... */}
        <form onSubmit={handlePostSubmit} className="space-y-4">
          {/* ... (title, imageUrl, content inputs) ... */}
           <div>
            <label htmlFor="title" className={labelClasses}>Post Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
          </div>
          <div>
            <label htmlFor="imageUrl" className={labelClasses}>Cover Image URL (Optional)</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="content" className={labelClasses}>Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="8" className={`${inputClasses} resize-y`} required></textarea>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50">
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              Publish Post
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      </div>

      {/* --- Section 2: Manage Existing Posts --- */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          Manage Posts
        </h2>
        
        {error && <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg"><strong>Error:</strong> {error}</div>}

        {!error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#2e4057] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2e4057]">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#797e88]">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        {/* 5. --- NEW LINKS --- */}
                        <Link to={`/blog/${post.slug}`} className="text-[#20a39e] hover:underline" target="_blank" rel="noopener noreferrer">
                          View
                        </Link>
                        <Link to={`/admin/posts/edit/${post._id}`} className="text-[#2e4057] hover:underline">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          className="text-[#ff6b6b] hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-[#797e88]">No posts found.</td>
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