// src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW

  const fetchUsers = (currentSearchTerm) => {
    setLoading(true);
    api.get('/admin/users', { params: { search: currentSearchTerm } })
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Refetch when searchTerm changes (with debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchUsers(searchTerm);
    }, 500) // Debounce search to avoid too many requests
    
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm]);

  const handleToggleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'unblock' : 'block'} this user?`)) {
      try {
        await api.put(`/admin/users/${id}/status`, { status: newStatus });
        fetchUsers(searchTerm); // Refresh the list with current search
      } catch (err) {
        alert('Failed to update user status.');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to DELETE this user? This action is permanent and will remove all their applications and tickets.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers(searchTerm); // Refresh the list with current search
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-dark-slate">Manage Users</h2>
        {/* NEW SEARCH INPUT */}
        <input 
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Contact</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4">
                  <div className="text-xs">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleToggleBlock(user.id, user.status)}
                    className={`font-medium ${user.status === 'active' ? 'text-yellow-600 hover:underline' : 'text-blue-600 hover:underline'}`}
                  >
                    {user.status === 'active' ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;