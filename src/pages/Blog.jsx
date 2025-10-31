import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';

// --- Reusable Blog Post Card Component ---
const BlogPostCard = ({ post }) => {
  // Helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden h-full transition duration-300 hover:shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Image */}
      {post.imageUrl && (
        <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
          <img 
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105" 
            src={post.imageUrl} 
            alt={post.title} 
          />
        </Link>
      )}
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold font-heading text-[#2e4057] mb-2 dark:text-white">
          {post.title}
        </h3>
        <p className="text-sm text-[#797e88] mb-4 dark:text-neutral-400 flex items-center gap-x-2">
           <FaCalendarAlt /> <span>{formatDate(post.createdAt)}</span>
           <span className="mx-1">|</span>
           <FaUser /> <span>{post.author}</span>
        </p>
        
        {/* Read More Link */}
        <Link
          to={`/blog/${post.slug}`}
          className="text-[#ffc72c] font-semibold hover:text-[#daa520] mt-auto self-start" // JUKANES Primary color
        >
          Read More <FaArrowRight className="inline text-xs ml-1" />
        </Link>
      </div>
    </div>
  );
};
// --- End of Blog Post Card ---


// --- Main Blog Page Component ---
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/posts'); // Fetches all posts
        if (!response.ok) throw new Error('Failed to fetch posts');
        const result = await response.json();
        setPosts(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10 text-center"> {/* JUKANES Light BG */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-[#2e4057]">Blog & Updates</h1>
          <nav aria-label="breadcrumb">
            <ol className="flex justify-center space-x-2 text-[#797e88]">
              <li className="breadcrumb-item"><Link to="/" className="hover:text-[#ffc72c]">Home</Link></li>
              <li className="breadcrumb-item text-gray-500" aria-current="page">/ Blog</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-center text-[#797e88] col-span-3">No posts found. Go to the admin dashboard to create one!</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;