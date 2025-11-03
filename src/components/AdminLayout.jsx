import React, { useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaFileContract, FaDonate, FaSignOutAlt, FaBars, FaPenSquare } from 'react-icons/fa';
import 'preline/dist/preline.js';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth(); // Get current user

  useEffect(() => {
    // This re-initializes Preline's UI components on page change
    if (window.HSOverlay) {
      window.HSOverlay.autoInit();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  // --- Reusable NavLink className function (styled for JUKANES) ---
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg";
    // Active: Yellow BG, Dark text
    // Default: Light BG, Dark text, Teal hover
    return isActive
      ? `${baseClasses} bg-[#ffc72c] text-[#2e4057] font-semibold`
      : `${baseClasses} text-[#2e4057] hover:bg-[#ffc72c]/50`;
  };

  return (
    // Main wrapper with light gray background for the content area
    <div className="bg-gray-100">
      {/* ========== HEADER (JUKANES Dark Blue) ========== */}
      <header className="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-[#2e4057] text-sm py-2.5 px-4 sm:px-6 border-b border-gray-700">
        <nav className="flex basis-full items-center w-full mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-x-3">
              {/* Sidebar Toggle (for mobile) */}
              <button
                type="button"
                className="p-2 inline-flex items-center gap-x-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg lg:hidden"
                data-hs-overlay="#admin-sidebar"
                aria-controls="admin-sidebar"
                aria-label="Toggle sidebar"
              >
                <FaBars className="shrink-0 size-4" />
              </button>
              
              {/* Logo (JUKANES Yellow) */}
              <Link to="/admin/dashboard" className="flex-none text-xl font-semibold font-heading text-[#ffc72c]" aria-label="JUKANES Admin">
                JUKANES Admin
              </Link>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-x-3 ms-auto">
              {/* User Account Dropdown */}
              <div className="hs-dropdown relative inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right]">
                <button id="hs-admin-account-dropdown" type="button" className="p-1.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-white/10 focus:outline-none">
                  {/* Placeholder image, you can change this */}
                  <img className="shrink-0 size-8 rounded-full" src="/img/team-1.jpg" alt="Admin Avatar" />
                  <span className="hidden md:block">
                    <span className="font-medium text-white">{currentUser?.email || 'Admin'}</span>
                  </span>
                  <svg className="hidden md:block shrink-0 size-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {/* Dropdown Menu (Light theme) */}
                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-50 bg-white border border-gray-200 rounded-xl shadow-xl" aria-labelledby="hs-admin-account-dropdown">
                  <div className="p-1 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="shrink-0 size-4" />
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* ========== END HEADER ========== */}

      {/* ========== SIDEBAR (JUKANES Light Yellow) ========== */}
      <div
        id="admin-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-[#fffacd] border-e border-gray-200 pt-[62px] pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0"
      >
        <nav className="p-4 w-full flex flex-col flex-wrap">
          {/* Main Navigation */}
          <div className="pt-3 mt-3 flex flex-col border-t border-[#daa520]/30">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-[#20a39e]">
              Home
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink className={getNavLinkClass} to="/admin/dashboard" end>
                  <FaTachometerAlt />
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Data Navigation */}
          <div className="pt-3 mt-3 flex flex-col border-t border-[#daa520]/30">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-[#20a39e]">
              Data
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink className={getNavLinkClass} to="/admin/donations">
                  <FaDonate />
                  Donations
                </NavLink>
              </li>
              <li>
                <NavLink className={getNavLinkClass} to="/admin/contacts">
                  <FaFileContract />
                  Messages
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* Content Section */}
          <div className="pt-3 mt-3 flex flex-col border-t border-[#daa520]/30">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-[#20a39e]">
              Content
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink className={getNavLinkClass} to="/admin/posts">
                  <FaPenSquare />
                  Posts
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {/* ========== END SIDEBAR ========== */}

      {/* ========== MAIN CONTENT ========== */}
      {/* This main area has a light gray background for contrast */}
      <main className="w-full pt-16 lg:ps-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* This renders the child page (Dashboard, Donations, etc.) */}
        </div>
      </main>
      {/* ========== END MAIN CONTENT ========== */}
    </div>
  );
};

export default AdminLayout;