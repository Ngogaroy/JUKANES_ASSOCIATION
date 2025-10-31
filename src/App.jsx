import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import NotFound from './pages/NotFound';

// Import Main Pages
import Home from './pages/Home';
import About from './pages/About';
import OurWork from './pages/OurWork';
import Transparency from './pages/Transparency';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import PaymentSuccess from './pages/PaymentSuccess';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Import Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDonations from './pages/AdminDonations';
import AdminContacts from './pages/AdminContacts';
import AdminPosts from './pages/AdminPosts';

const router = createBrowserRouter([
  {
    // --- Main Public Website ---
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'our-work', element: <OurWork /> },
      { path: 'transparency', element: <Transparency /> },
      { path: 'contact', element: <Contact /> },
      { path: 'donate', element: <Donate /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: 'blog', element: <Blog /> },
      
      // --- THIS IS THE FIX ---
      // It now correctly matches /blog/your-post-title
      { path: 'blog/:slug', element: <BlogPost /> }, 
      
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    // --- Admin Login (No Layout) ---
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    // --- Admin Section (Uses AdminLayout) ---
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'donations', element: <AdminDonations /> },
      { path: 'contacts', element: <AdminContacts /> },
      { path: 'posts', element: <AdminPosts /> },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;