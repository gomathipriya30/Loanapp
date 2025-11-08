// src/pages/admin/ManageApplications.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import ApplicationDetailModal from '../../components/admin/ApplicationDetailModal';

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'accepted-disbursed': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'accepted-not-disbursed': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW STATE for Search & Filter ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  
  const fetchApplications = (currentSearch, currentStatus) => {
    setLoading(true);
    api.get('/admin/applications', { 
      params: { 
        search: currentSearch, 
        status: currentStatus 
      } 
    })
    .then(response => {
      setApplications(response.data);
    })
    .catch(err => {
      setError('Failed to fetch applications.');
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Refetch when search or filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchApplications(searchTerm, statusFilter);
    }, 500) // Debounce to avoid rapid API calls
    
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, statusFilter]);
  
  // Function to open the modal
  const handleRowClick = (id) => {
    setSelectedAppId(id);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = (refresh) => {
    setIsModalOpen(false);
    setSelectedAppId(null);
    if (refresh) {
      fetchApplications(searchTerm, statusFilter); // Refetch with current filters
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-slate mb-6">Manage Loan Applications</h2>
      
      {/* --- NEW FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input 
          type="text"
          placeholder="Search by name, email, or loan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="accepted-not-disbursed">Accepted (Not Disbursed)</option>
          <option value="accepted-disbursed">Accepted (Disbursed)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Applicant</th>
              <th scope="col" className="px-6 py-3">Loan</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-4">No applications found.</td></tr>
            ) : (
              applications.map((app) => (
                <tr 
                  key={app.id} 
                  onClick={() => handleRowClick(app.id)}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{app.user_name}</div>
                    <div className="text-xs text-gray-500">{app.user_email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{app.loan_name}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">${Number(app.amount_required).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render the modal */}
      {isModalOpen && (
        <ApplicationDetailModal
          applicationId={selectedAppId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ManageApplications;