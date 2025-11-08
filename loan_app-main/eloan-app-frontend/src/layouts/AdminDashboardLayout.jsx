import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

function AdminDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen md:flex">
            {/* Mobile menu button */}
            <div className="bg-gray-800 text-gray-100 flex justify-end md:hidden">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 focus:outline-none focus:bg-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div className={`bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-lg z-20`}>
                <AdminSidebar />
            </div>

            {/* Main content */}
            <main className="flex-1 p-6 lg:p-10 bg-gray-100 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminDashboardLayout;
