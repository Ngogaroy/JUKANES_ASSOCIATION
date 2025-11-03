import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaDonate, FaEnvelopeOpenText, FaPenSquare } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';

// --- Reusable Stat Card Component (Styled for JUKANES) ---
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-x-4`}>
    <div className={`flex-shrink-0 flex justify-center items-center size-12 rounded-lg ${colorClass.bg} ${colorClass.text}`}>
      <Icon className="size-6" />
    </div>
    <div className="flex-1">
      <p className="text-sm uppercase text-[#797e88]">{title}</p>
      <p className="text-xl font-bold font-heading text-[#2e4057]">{value}</p>
    </div>
  </div>
);

// --- Main Dashboard Component ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return; // Wait for Firebase
    if (!currentUser) {
      navigate('/admin-login');
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(`Failed to fetch stats: ${errData.msg || response.statusText}`);
        }
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [currentUser, authLoading, navigate]);

  // --- Format Data for Chart ---
  const donationTotalKES = stats?.donations.find(d => d._id === 'kes')?.total || 0;
  const donationTotalUSD = stats?.donations.find(d => d._id === 'usd')?.total || 0;

  // Chart options (styled for JUKANES brand)
  const chartOptions = {
    chart: {
      id: 'donations-chart',
      toolbar: { show: false },
      fontFamily: "'Work Sans', sans-serif",
    },
    xaxis: {
      categories: ['KES Donations', 'USD Donations', 'Total Messages', 'Blog Posts'],
      labels: { style: { colors: '#797e88' } },
    },
    yaxis: { labels: { style: { colors: '#797e88' } } },
    colors: ['#20a39e', '#ffc72c', '#2e4057', '#ff6b6b'], // JUKANES Palette
    plotOptions: { bar: { borderRadius: 4, horizontal: false, distributed: true } },
    legend: { show: false },
    dataLabels: { enabled: false },
    theme: { mode: 'light' }
  };

  // Chart series data
  const chartSeries = [
    {
      name: 'Total',
      data: [
        donationTotalKES,
        donationTotalUSD,
        stats?.contacts || 0,
        stats?.posts || 0,
      ],
    },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h1 className="font-medium text-lg text-[#2e4057]">
            Dashboard
          </h1>
          <p className="text-sm text-[#797e88]">
            Welcome, Admin. Here's a summary of your site's activity.
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Link to="/admin/posts" className="inline-flex items-center gap-2 bg-[#20a39e] text-white font-semibold py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-200">
            <FaPenSquare />
            Create New Post
          </Link>
        </div>
      </div>
      {/* End Header */}

      {/* --- Stat Cards Grid (Styled) --- */}
      {error && (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">
          <strong>Error fetching stats:</strong> {error.message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total KES Donations" 
          value={`Ksh ${donationTotalKES.toLocaleString()}`} 
          icon={FaDonate} 
          colorClass={{ bg: 'bg-[#20a39e]/10', text: 'text-[#20a39e]' }} // Teal
        />
        <StatCard 
          title="Total USD Donations" 
          value={`$ ${donationTotalUSD.toLocaleString()}`} 
          icon={FaDonate} 
          colorClass={{ bg: 'bg-[#ffc72c]/10', text: 'text-[#daa520]' }} // Yellow
        />
        <StatCard 
          title="Contact Messages" 
          value={stats?.contacts || 0} 
          icon={FaEnvelopeOpenText} 
          colorClass={{ bg: 'bg-[#2e4057]/10', text: 'text-[#2e4057]' }} // Dark Blue
        />
      </div>

      {/* --- Chart (Styled) --- */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold font-heading text-[#2e4057] mb-4">
          JUKANES Overview
        </h2>
        <div className="min-h-[300px] rounded-lg">
          {typeof window !== 'undefined' && (
            <ReactApexChart 
              options={chartOptions} 
              series={chartSeries} 
              type="bar" 
              width="100%" 
              height="350" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;