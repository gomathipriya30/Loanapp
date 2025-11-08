// src/layouts/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ArchiveBoxIcon as CollectionIcon,
  CalculatorIcon,
  QuestionMarkCircleIcon as SupportIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/outline';

function Sidebar({ closeSidebar, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    if (closeSidebar) closeSidebar();
  };

  // --- Styling Classes for Dark Theme ---
  const linkBaseClasses = "flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out group text-sm font-medium relative";
  const linkInactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";
  const linkActiveClasses = "bg-primary-green/10 text-primary-green font-semibold";

  const getLinkClasses = ({ isActive }) => `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`;
  
  const iconBaseClasses = "h-5 w-5 mr-3 flex-shrink-0";
  const iconInactiveClasses = "text-gray-500 group-hover:text-white";
  const iconActiveClasses = "text-primary-green";

  const getIconClasses = (isActive) => `${iconBaseClasses} ${isActive ? iconActiveClasses : iconInactiveClasses}`;
  // --- End Styling ---

  return (
    // Added dark background and border to the sidebar itself
    <div className="flex flex-col h-full py-4 bg-[#1F2937] border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6 px-4 flex-shrink-0 h-12">
         <img 
            src="/logo2.png" // Assumes logo2.png is in the 'public' folder
            alt="Conzura Logo" 
            className="h-9 w-auto" // Adjust height (h-9) as needed
         />
        {/* <span className="text-xl font-semibold text-white tracking-tight ml-2">Conzura</span> */}
      </div>

      {/* User Profile Area */}
      <div className="px-4 mb-4 flex-shrink-0">
          <div className="p-3 bg-gray-700/40 rounded-lg flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center text-white font-bold text-xs mr-3">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                  <p className="text-sm font-semibold text-gray-200">{userName}</p>
                  <p className="text-xs text-gray-400">Member</p>
              </div>
          </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1 px-2 overflow-y-auto">
        <NavLink to="/dashboard/loans" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><HomeIcon className={getIconClasses(isActive)} /> Available Loans</>)}
        </NavLink>
        <NavLink to="/dashboard/my-loans" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><CollectionIcon className={getIconClasses(isActive)} /> My Loans</>)}
        </NavLink>
        <NavLink to="/dashboard/calculator" className={getLinkClasses} onClick={closeSidebar}>
          {({ isActive }) => (<><CalculatorIcon className={getIconClasses(isActive)} /> EMI Calculator</>)}
        </NavLink>
        <NavLink to="/dashboard/support" className={getLinkClasses} onClick={closeSidebar}>
           {({ isActive }) => (<><SupportIcon className={getIconClasses(isActive)} /> Support Center</>)}
        </NavLink>
        <NavLink to="/dashboard/profile" className={getLinkClasses} onClick={closeSidebar}>
           {({ isActive }) => (<><UserIcon className={getIconClasses(isActive)} /> My Profile</>)}
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

export default Sidebar;