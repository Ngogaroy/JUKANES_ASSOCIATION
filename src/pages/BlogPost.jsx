import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpinner, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BlogPost = () => {
  const { slug } = useParams(); // Gets the ':slug' from the URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- THIS IS THE FIX ---
        // Removed the leading dot './' to make it an absolute path
        const response = await fetch(`/api/blog/${slug}`); 
        // --- END OF FIX ---

        if (!response.ok) {
          throw new Error('Post not found');
        }
        const result = await response.json();
        setPost(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]); // Re-run this effect if the slug changes

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error: {error}</h1>
        <Link to="/blog" className="text-[#20a39e] hover:underline mt-4 inline-block">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return null; // Should be covered by error state
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-[#2e4057]">
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-x-6 text-[#797e88]">
            <span className="flex items-center gap-x-2">
              <FaCalendarAlt /> {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-x-2">
              <FaUser /> {post.author}
            </span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-4xl">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg mb-8"
          />
        )}
        {/* We use whitespace-pre-wrap to respect new lines from the textarea */}
        {/* We use 'prose' from Tailwind Typography for nice article styling */}
        <div className="prose lg:prose-xl max-w-none text-[#2e4057] whitespace-pre-wrap">
          {post.content}
        </div>
        <Link 
          to="/blog" 
          className="inline-block bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200 mt-12"
        >
          &larr; Back to All Posts
        </Link>
      </div>
    </>
  );
};

export default BlogPost;