// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

// Self-contained SVG icons to avoid dependencies
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const location = useLocation();

  // Get user name from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserName(JSON.parse(storedUser).name);
    }
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    // Use a soft, professional background color
    <div className="relative min-h-screen md:flex bg-gray-50">
      {/* --- Sidebar --- */}
      <div
        className={`bg-white text-gray-800 w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
                   z-40 border-r border-gray-200`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} userName={userName} />
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top bar with user name and icon */}
        <div className="bg-white text-gray-800 flex justify-between items-center md:hidden border-b border-gray-200 sticky top-0 z-20 px-4 h-16">
          <div className="flex items-center gap-2">
            <UserIcon />
            <span className="font-semibold text-sm">{userName}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md focus:outline-none focus:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;