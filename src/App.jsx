import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Layouts & Protected Route
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
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
import ProgramPage from './pages/ProgramPage';

// Import Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDonations from './pages/AdminDonations';
import AdminContacts from './pages/AdminContacts';
import AdminPosts from './pages/AdminPosts';
import AdminEditPost from './pages/AdminEditPost'; // <-- 1. Import new page

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
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    // --- Admin Login (No Main Layout) ---
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    // --- Admin Section (Now Protected) ---
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />, 
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'donations', element: <AdminDonations /> },
          { path: 'contacts', element: <AdminContacts /> },
          { path: 'posts', element: <AdminPosts /> },
          // 2. Add dynamic route for editing a post
          { path: 'posts/edit/:id', element: <AdminEditPost /> }, 
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;