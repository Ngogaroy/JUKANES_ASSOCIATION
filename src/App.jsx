import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Components
import Layout from './components/Layout';
import NotFound from './pages/NotFound'; // <-- 1. Import NotFound

// Import Main Pages
import Home from './pages/Home';
import About from './pages/About';
import OurWork from './pages/OurWork';
import Transparency from './pages/Transparency';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import PaymentSuccess from './pages/PaymentSuccess';

// Import Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter([
  {
    // --- Main Public Website ---
    path: '/',
    element: <Layout />, // Uses the main layout (Navbar, Footer, etc.)
    errorElement: <NotFound />, // <-- 2. Add as main error element
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'our-work', element: <OurWork /> },
      { path: 'transparency', element: <Transparency /> },
      { path: 'contact', element: <Contact /> },
      { path: 'donate', element: <Donate /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: '*', element: <NotFound /> }, // <-- 3. Add as wildcard for no match
    ],
  },
  {
    // --- Admin Section (No Main Layout) ---
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;