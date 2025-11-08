// src/pages/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

function Settings() {
  const [settings, setSettings] = useState({
    appName: '',
    contactEmail: '',
    maintenanceMode: 'false',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSettings(prev => ({ ...prev, [id]: String(checked) }));
    } else {
      setSettings(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await api.put('/admin/settings', settings);
      setMessage(res.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">
        Application Settings
      </h2>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-lg">
        <style>{`.input-field { width: 100%; padding: 0.5rem 1rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; outline: none; } .input-field:focus { box-shadow: 0 0 0 2px #E67E22; border-color: #E67E22; }`}</style>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="appName" className="block text-sm font-semibold text-gray-700 mb-1">
              Application Name
            </label>
            <input
              type="text"
              id="appName"
              value={settings.appName}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-1">
              Support Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode === 'true'}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-accent-orange focus:ring-accent-orange"
            />
            <label htmlFor="maintenanceMode" className="text-sm font-semibold text-gray-700">
              Enable Maintenance Mode
            </label>
          </div>
          
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto px-6 py-2 bg-accent-orange text-white font-bold rounded-lg hover:bg-accent-orange-dark transition-colors duration-300 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;