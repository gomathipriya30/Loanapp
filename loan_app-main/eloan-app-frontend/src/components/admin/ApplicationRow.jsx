// src/components/admin/ApplicationRow.jsx
import React, { useState } from 'react';
import api from '../../api';

// Define the statuses
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'accepted-not-disbursed', label: 'Accepted (Not Disbursed)' },
  { value: 'accepted-disbursed', label: 'Accepted (Disbursed)' },
  { value: 'rejected', label: 'Rejected' },
];

function ApplicationRow({ app }) {
  // Local state for this specific row
  const [currentStatus, setCurrentStatus] = useState(app.status);
  const [currentNote, setCurrentNote] = useState(app.note || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.put(`/admin/applications/${app.id}`, {
        status: currentStatus,
        note: currentNote,
      });
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2s
    } catch (err) {
      setMessage('Failed to save.');
      console.error(err);
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Get a color class based on status for styling
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

  return (
    <tr className="bg-white border-b hover:bg-gray-50 align-top">
      {/* Application Info */}
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{app.user_name}</div>
        <div className="text-xs text-gray-500">{app.user_email}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{app.loan_name}</div>
        <div className="text-xs text-gray-500">
          Amount: ${Number(app.amount_required).toLocaleString()}
        </div>
      </td>
      
      {/* Status Column (Dropdown) */}
      <td className="px-6 py-4">
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
          className={`text-xs font-medium px-2.5 py-0.5 rounded border-none focus:ring-2 focus:ring-accent-orange ${getStatusColor(currentStatus)}`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>

      {/* Note Column (Textarea) */}
      <td className="px-6 py-4">
        <textarea
          rows="2"
          placeholder="Add a note..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange"
        ></textarea>
      </td>

      {/* Action Column (Save Button) */}
      <td className="px-6 py-4">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-accent-orange rounded-lg hover:bg-accent-orange-dark disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {message && <p className="text-xs text-center mt-1">{message}</p>}
      </td>
    </tr>
  );
}

export default ApplicationRow;