import React, { useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
// 1. Import the new icon for 'Posts'
import { FaTachometerAlt, FaFileContract, FaDonate, FaSignOutAlt, FaBars, FaPenSquare } from 'react-icons/fa';

// Import Preline's JS
import 'preline/dist/preline.js';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Re-initializes Preline's UI components on page change
  useEffect(() => {
    if (window.HSOverlay) {
      window.HSOverlay.autoInit();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('jukanes-admin-auth');
    navigate('/admin-login');
  };

  return (
    <div className="bg-gray-100 dark:bg-neutral-900">
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-white text-sm py-2.5 px-4 sm:px-6 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <nav className="flex basis-full items-center w-full mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-x-3">
              {/* Sidebar Toggle (for mobile) */}
              <button
                type="button"
                className="p-2 inline-flex items-center gap-x-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-neutral-400 dark:hover:bg-neutral-700 lg:hidden"
                data-hs-overlay="#admin-sidebar"
                aria-controls="admin-sidebar"
                aria-label="Toggle sidebar"
              >
                <FaBars className="shrink-0 size-4" />
              </button>
              
              {/* Logo */}
              <Link to="/admin/dashboard" className="flex-none text-xl font-semibold font-heading text-[#2e4057] dark:text-white" aria-label="JUKANES Admin">
                JUKANES Admin
              </Link>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-x-3 ms-auto">
              {/* User Account Dropdown */}
              <div className="hs-dropdown relative inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right]">
                <button id="hs-admin-account-dropdown" type="button" className="p-1.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-100 focus:outline-none dark:hover:bg-neutral-700">
                  <img className="shrink-0 size-8 rounded-full" src="/img/team-1.jpg" alt="Admin Avatar" />
                  <span className="hidden md:block">
                    <span className="font-medium text-gray-800 dark:text-neutral-200">Admin</span>
                  </span>
                  <svg className="hidden md:block shrink-0 size-4 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {/* Dropdown Menu */}
                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-50 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700" aria-labelledby="hs-admin-account-dropdown">
                  <div className="p-1 border-t border-gray-200 dark:border-neutral-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-neutral-800"
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

      {/* ========== SIDEBAR ========== */}
      <div
        id="admin-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-[62px] pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
      >
        <nav className="p-4 w-full flex flex-col flex-wrap">
          {/* Main Navigation */}
          <div className="pt-3 mt-3 flex flex-col border-t border-gray-200 dark:border-neutral-700">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-800 dark:text-neutral-500">
              Home
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink
                  className={({ isActive }) => `w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg ${isActive ? 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700'}`}
                  to="/admin/dashboard" end
                >
                  <FaTachometerAlt />
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Data Navigation */}
          <div className="pt-3 mt-3 flex flex-col border-t border-gray-200 dark:border-neutral-700">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-800 dark:text-neutral-500">
              Data
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink
                  className={({ isActive }) => `w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg ${isActive ? 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700'}`}
                  to="/admin/donations"
                >
                  <FaDonate />
                  Donations
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => `w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg ${isActive ? 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700'}`}
                  to="/admin/contacts"
                >
                  <FaFileContract />
                  Messages
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* --- NEW Posts Section --- */}
          <div className="pt-3 mt-3 flex flex-col border-t border-gray-200 dark:border-neutral-700">
            <span className="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-800 dark:text-neutral-500">
              Content
            </span>
            <ul className="flex flex-col gap-y-1">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg ${isActive ? 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700'}`
                  }
                  to="/admin/posts" // <-- 2. Add Link
                >
                  <FaPenSquare />
                  Posts
                </NavLink>
              </li>
            </ul>
          </div>
          {/* --- END NEW Section --- */}

        </nav>
      </div>
      {/* ========== END SIDEBAR ========== */}

      {/* ========== MAIN CONTENT ========== */}
      <main className="w-full pt-16 lg:ps-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      {/* ========== END MAIN CONTENT ========== */}
    </div>
  );
};

export default AdminLayout;