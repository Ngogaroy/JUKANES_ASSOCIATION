import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import components
import Layout from './components/Layout';
import Home from './pages/Home';         // <-- Import Home
import OurWork from './pages/OurWork';   // <-- Import OurWork
import Donate from './pages/Donate';     // <-- Import Donate
import Contact from './pages/Contact';
import About from './pages/About';  // <-- Import About
import PaymentSuccess from './pages/PaymentSuccess';

// Define routes using imported components
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },     // <-- Use imported Home
      { path: 'our-work', element: <OurWork /> }, // <-- Use imported OurWork
      { path: 'donate', element: <Donate /> },   // <-- Use imported Donate
      { path: 'contact', element: <Contact /> },   // <-- Use imported Contact
      { path: 'about', element: <About /> },       // <-- Use imported About
      { path: 'payment-success', element: <PaymentSuccess /> }, // <-- Use imported PaymentSuccess
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;