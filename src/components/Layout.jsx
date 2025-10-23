import React from 'react';
import { Outlet } from 'react-router-dom'; // Renders the matched page component
import Topbar from './Topbar';
import Navbar from './Navbar';
import Newsletter from './Newsletter'; // The styled newsletter section
import Footer from './Footer'; // The styled footer
import BackToTopButton from './BackToTopButton'; // The styled back-to-top button

const Layout = () => {
  return (
    // Main container ensuring footer stays at the bottom
    <div className="flex flex-col min-h-screen bg-white">
      <Topbar /> {/* Appears at the very top */}
      <Navbar /> {/* Appears below Topbar */}
      <main className="flex-grow"> {/* Main page content area */}
        {/* Component for the current route (Home, About, etc.) renders here */}
        <Outlet />
      </main>
      <Newsletter /> {/* Appears above the Footer */}
      <Footer /> {/* Appears at the bottom */}
      <BackToTopButton /> {/* Positioned fixed, usually bottom-right */}
    </div>
  );
};

export default Layout;