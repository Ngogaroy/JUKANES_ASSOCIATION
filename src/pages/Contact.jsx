import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  // New states to manage loading and response messages
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null); // To show success or error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);   // Show loading indicator
    setResponseMsg(null); // Clear previous messages

    try {
      // Send the form data to our new API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        setResponseMsg({ type: 'success', text: 'Message sent successfully!' });
        // Clear the form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Handle server errors
        setResponseMsg({ type: 'error', text: result.msg || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      // Handle network errors
      console.error('Submission error:', error);
      setResponseMsg({ type: 'error', text: 'An error occurred. Please check your connection.' });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Reusable input styles
  const inputBaseClasses = "w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffc72c] focus:border-transparent placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-[#2e4057] mb-1";

  return (
    <div className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mx-auto max-w-lg mb-12">
          <p className="font-heading text-[#ffc72c] font-semibold mb-2">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">Get In Touch</h1>
          <p className="text-[#797e88]">
            Have questions or want to get involved? Send us a message!
          </p>
        </div>

        {/* Main Content Grid (Form + Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Form (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-heading font-semibold text-[#2e4057] mb-6">Send Us A Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClasses}>Your Name</label>
                  <input
                    type="text" id="name" name="name"
                    className={inputBaseClasses} placeholder="John Doe"
                    value={formData.name} onChange={handleChange} required
                  />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClasses}>Your Email</label>
                  <input
                    type="email" id="email" name="email"
                    className={inputBaseClasses} placeholder="john.doe@example.com"
                    value={formData.email} onChange={handleChange} required
                  />
                </div>
              </div>
              {/* Subject */}
              <div className="mb-6">
                <label htmlFor="subject" className={labelClasses}>Subject</label>
                <input
                  type="text" id="subject" name="subject"
                  className={inputBaseClasses} placeholder="Regarding donation / volunteering / etc."
                  value={formData.subject} onChange={handleChange} required
                />
              </div>
              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className={labelClasses}>Message</label>
                <textarea
                  id="message" name="message" rows="5"
                  className={`${inputBaseClasses} resize-none`} placeholder="Write your message here..."
                  value={formData.message} onChange={handleChange} required
                ></textarea>
              </div>
              
              {/* Submit Button & Response Message */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-block bg-[#20a39e] text-white font-semibold py-3 px-8 rounded hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#20a39e] focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
                
                {/* Show success/error message */}
                {responseMsg && (
                  <div className={`text-sm ${responseMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {responseMsg.text}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info (Takes 1 column on large screens) */}
          <div className="space-y-8">
            <div className="bg-[#fffacd] p-6 rounded-lg shadow">
              <h3 className="text-2xl font-heading font-semibold text-[#2e4057] mb-4 flex items-center">
                <FaMapMarkerAlt className="text-[#ffc72c] mr-3 text-xl" /> Address
              </h3>
              <p className="text-[#797e88]">Nairobi, Kenya</p>
            </div>
            <div className="bg-[#fffacd] p-6 rounded-lg shadow">
              <h3 className="text-2xl font-heading font-semibold text-[#2e4057] mb-4 flex items-center">
                <FaEnvelope className="text-[#ffc72c] mr-3 text-xl" /> Email Us
              </h3>
              <a href="mailto:jukanesassociation@gmail.com" className="text-[#797e88] hover:text-[#ffc72c] break-all">jukanesassociation@gmail.com</a>
            </div>
            <div className="bg-[#fffacd] p-6 rounded-lg shadow">
              <h3 className="text-2xl font-heading font-semibold text-[#2e4057] mb-4 flex items-center">
                 <FaPhoneAlt className="text-[#ffc72c] mr-3 text-xl" /> Call Us
              </h3>
              <a href="tel:+01234567890" className="text-[#797e88] hover:text-[#ffc72c]">+254 748 487 789</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;