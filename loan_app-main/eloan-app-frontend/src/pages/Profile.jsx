// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import UpdateProfileForm from '../components/user/UpdateProfileForm';
import ChangePasswordForm from '../components/user/ChangePasswordForm';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(''); // Clear previous errors
        const res = await api.get('/users/profile');
        setProfileData(res.data);
      } catch (err) {
        setError('Failed to load profile data. Please try refreshing the page.');
        console.error("Profile fetch error:", err); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  // Loading State UI
  if (loading) return (
      <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
  );

  // Error State UI
  if (error) return (
      <div className="text-center p-6 text-red-700 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold">Could not load profile.</p>
          <p>{error}</p>
      </div>
  );

  return (
    // Add fade-in animation and spacing between sections
    <div className="space-y-10 animate-fade-in">
      {/* --- Profile Details Section --- */}
      <div>
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">My Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your personal information.</p>
        {/* Card Container */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-gray-200">
           {/* Define shared input styles for child components */}
           <style>{`
             .label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-medium; color: #4B5563; /* gray-600 */ }
             .input-field { display: block; width: 100%; padding: 0.65rem 0.75rem; border: 1px solid #D1D5DB; /* gray-300 */ border-radius: 0.5rem; outline: none; transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out; font-size: 0.875rem; }
             .input-field:focus { box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2); /* primary-green focus ring */ border-color: #27ae60; /* primary-green */ }
             .input-field:disabled { background-color: #f3f4f6; /* gray-100 */ cursor: not-allowed; opacity: 0.7; }
           `}</style>
           {/* Render the profile form, passing fetched data */}
           {profileData && <UpdateProfileForm initialData={profileData} />}
        </div>
      </div>

      {/* --- Change Password Section --- */}
      <div>
         {/* Section Header */}
         <h2 className="text-2xl font-semibold text-gray-800 mb-1">Security Settings</h2>
         <p className="text-sm text-gray-500 mb-6">Change your account password.</p>
         {/* Card Container */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-gray-200">
          <ChangePasswordForm />
        </div>
      </div>

       {/* Simple fade-in animation style */}
       <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

export default Profile;