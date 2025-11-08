// src/components/user/ChangePasswordForm.jsx
import React, { useState } from 'react';
import api from '../../api';

// Self-contained SVG for the loading spinner
const SpinnerIcon = () => (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: '', newPassword: '', confirmNewPassword: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType(''); // Reset message type on new submission

    // Frontend validation for matching passwords
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage('New passwords do not match.');
      setMessageType('error');
      return;
    }

    // Basic length check (optional, but good practice)
    if (formData.newPassword.length < 6) {
        setMessage('New password must be at least 6 characters long.');
        setMessageType('error');
        return;
    }


    setLoading(true);
    try {
      const res = await api.post('/users/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setMessage(res.data.message);
      setMessageType('success');
      // Clear form on success
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const messageClass = messageType === 'success' ? 'text-green-600' : 'text-red-600';
  const labelStyles = "block text-sm font-medium text-gray-600 mb-1"; // Consistent label style

  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Added more vertical space */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
        <div>
          <label htmlFor="oldPassword" className={labelStyles}>Current Password</label>
          <input type="password" id="oldPassword" value={formData.oldPassword} onChange={handleChange} required className="input-field"/>
        </div>
        <div>
          <label htmlFor="newPassword" className={labelStyles}>New Password</label>
          <input type="password" id="newPassword" value={formData.newPassword} onChange={handleChange} required className="input-field"/>
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className={labelStyles}>Confirm New Password</label>
          <input type="password" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required className="input-field"/>
        </div>
      </div>

      {/* --- Message and Action Button --- */}
      <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-4">
         <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-primary-green text-white font-semibold rounded-lg shadow-sm hover:bg-primary-green-dark transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
                 <> <SpinnerIcon /> Updating... </>
            ) : 'Change Password'}
          </button>
          {message && <p className={`text-sm text-center font-medium ${messageClass}`}>{message}</p>}
      </div>
    </form>
  );
}

export default ChangePasswordForm;