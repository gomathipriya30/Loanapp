import React, { useState, useEffect } from 'react';
import api from '../../api';

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', aadhar: '', pan: '', 
    occupation: '', organization: '', password: '',
  });

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAdmins().finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    try {
      const response = await api.post('/admin/add-admin', formData);
      setMessage(response.data.message);
      setMessageType('success');
      fetchAdmins(); // Refresh admin list
      setFormData({
        name: '', phone: '', email: '', aadhar: '', pan: '', 
        occupation: '', organization: '', password: '',
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add admin.');
      setMessageType('error');
    }
  };

  const messageClass = messageType === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">Add New Admin</h2>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            {/* Using a simplified form for brevity. Expand as needed. */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input type="password" id="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"/>
                </div>
                {/* Add other fields (Aadhar, PAN) here if needed for admins */}
                <div className="md:col-span-2">
                    {message && <p className={`text-sm text-center font-semibold ${messageClass}`}>{message}</p>}
                    <button type="submit" className="w-full md:w-auto mt-2 px-6 py-2 bg-accent-orange text-white font-bold rounded-lg hover:bg-accent-orange-dark transition-colors duration-300">Create Admin</button>
                </div>
            </form>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">Existing Admins</h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="4" className="text-center p-4">Loading admins...</td></tr>
                    ) : (
                        admins.map((admin) => (
                        <tr key={admin.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{admin.id}</td>
                            <td className="px-6 py-4">{admin.name}</td>
                            <td className="px-6 py-4">{admin.email}</td>
                            <td className="px-6 py-4">{admin.phone}</td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;
