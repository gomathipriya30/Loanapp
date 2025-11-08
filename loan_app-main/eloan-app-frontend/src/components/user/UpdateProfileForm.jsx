// src/components/user/UpdateProfileForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

// Self-contained SVG for the loading spinner
const SpinnerIcon = () => (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function UpdateProfileForm({ initialData }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', occupation: '', organization: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  // Pre-fill the form when initialData is loaded
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        occupation: initialData.occupation || '',
        organization: initialData.organization || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const res = await api.put('/users/profile', formData);
      setMessage(res.data.message);
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const messageClass = messageType === 'success' ? 'text-green-600' : 'text-red-600';
  
  // A simple constant for label styles to keep JSX clean
  const labelStyles = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* --- Editable Fields --- */}
        <div>
          <label htmlFor="name" className={labelStyles}>Full Name</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} required className="input-field"/>
        </div>
        <div>
          <label htmlFor="email" className={labelStyles}>Email Address</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required className="input-field"/>
        </div>
        <div>
          <label htmlFor="phone" className={labelStyles}>Phone Number</label>
          <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required className="input-field"/>
        </div>
        <div>
          <label htmlFor="occupation" className={labelStyles}>Occupation</label>
          <input type="text" id="occupation" value={formData.occupation} onChange={handleChange} className="input-field"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="organization" className={labelStyles}>Organization</label>
          <input type="text" id="organization" value={formData.organization} onChange={handleChange} className="input-field"/>
        </div>

        {/* --- Read-only Fields Section --- */}
        <div className="md:col-span-2 pt-5 border-t border-gray-200">
           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Identification (Read-only)</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
               <div>
                 <label className={labelStyles}>Aadhar Number</label>
                 <input type="text" value={initialData.aadhar || ''} readOnly disabled className="input-field bg-gray-100 cursor-not-allowed"/>
               </div>
               <div>
                 <label className={labelStyles}>PAN Number</label>
                 <input type="text" value={initialData.pan || ''} readOnly disabled className="input-field bg-gray-100 cursor-not-allowed"/>
               </div>
           </div>
        </div>
      </div>

      {/* --- Message and Action Button --- */}
      <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-4">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-primary-green text-white font-semibold rounded-lg shadow-sm hover:bg-primary-green-dark transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
                <> <SpinnerIcon /> Saving... </>
            ) : 'Save Profile Changes'}
          </button>
          {message && <p className={`text-sm text-center font-medium ${messageClass}`}>{message}</p>}
      </div>
    </form>
  );
}

export default UpdateProfileForm;