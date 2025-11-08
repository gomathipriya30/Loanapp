// src/layouts/AdminSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon, // <-- CHANGED from ClipboardListIcon
  LifebuoyIcon, // Assuming this exists or replace if needed
  ArchiveBoxIcon as CollectionIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/outline'; // Correct path for v2+

function AdminSidebar({ closeSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    if (closeSidebar) closeSidebar();
  };

  // --- Styling Classes for Dark Theme ---
  const linkBaseClasses = "flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out group text-sm font-medium relative";
  const linkInactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";
  const linkActiveClasses = "bg-accent-orange/10 text-accent-orange font-semibold";

  const getLinkClasses = ({ isActive }) => `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`;

  const iconBaseClasses = "h-5 w-5 mr-3 flex-shrink-0";
  const iconInactiveClasses = "text-gray-500 group-hover:text-white";
  const iconActiveClasses = "text-accent-orange";

  const getIconClasses = (isActive) => `${iconBaseClasses} ${isActive ? iconActiveClasses : iconInactiveClasses}`;
  // --- End Styling ---

  return (
    <div className="flex flex-col h-full py-4 bg-[#1F2937] border-r border-gray-700">
      {/* Logo and Title */}
      <div className="flex items-center justify-center mb-6 px-4 flex-shrink-0 h-12">
         <img
            src="/logo2.png" // Assumes logo2.png is in the 'public' folder
            alt="Conzura Logo"
            className="h-9 w-auto"
         />
        <span className="text-xl font-semibold text-white tracking-tight ml-2"> <span className="text-accent-orange/80">Admin</span></span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1 px-2 overflow-y-auto">
        <NavLink to="/admin/dashboard/stats" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><ChartBarIcon className={getIconClasses(isActive)} /> Dashboard</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/applications" className={getLinkClasses} onClick={closeSidebar}>
          {/* // <-- CHANGED Icon Component */}
          {({ isActive }) => (<><DocumentTextIcon className={getIconClasses(isActive)} /> Applications</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/support" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><LifebuoyIcon className={getIconClasses(isActive)} /> Support Tickets</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/loans" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><CollectionIcon className={getIconClasses(isActive)} /> Loan Products</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/users" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><UserGroupIcon className={getIconClasses(isActive)} /> Manage Users</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/admins" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><ShieldCheckIcon className={getIconClasses(isActive)} /> Manage Admins</>)}
        </NavLink>
        <NavLink to="/admin/dashboard/settings" className={getLinkClasses} onClick={closeSidebar}>
           {({ isActive }) => (<><CogIcon className={getIconClasses(isActive)} /> Settings</>)}
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-4 pt-4 px-2 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`${linkBaseClasses} w-full text-gray-400 hover:bg-red-500/10 hover:text-red-400`}
        >
           <LogoutIcon className={`${iconBaseClasses} text-gray-500 group-hover:text-red-400`} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;