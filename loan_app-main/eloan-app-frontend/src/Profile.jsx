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
        const res = await api.get('/users/profile');
        setProfileData(res.data);
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">
          My Profile
        </h2>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <style>{`.input-field { width: 100%; padding: 0.5rem 1rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; outline: none; } .input-field:focus { ring: 2px; ring-color: #27ae60; border-color: #27ae60; }`}</style>
          <UpdateProfileForm initialData={profileData} />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">
          Change Password
        </h2>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default Profile;