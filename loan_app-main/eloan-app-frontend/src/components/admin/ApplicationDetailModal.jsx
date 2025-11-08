// src/components/admin/ApplicationDetailModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

// Define the statuses
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'accepted-not-disbursed', label: 'Accepted (Not Disbursed)' },
  { value: 'accepted-disbursed', label: 'Accepted (Disbursed)' },
  { value: 'rejected', label: 'Rejected' },
];

function ApplicationDetailModal({ applicationId, isOpen, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state for the form
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await api.get(`/admin/applications/${applicationId}`);
          setDetails(res.data);
          setCurrentStatus(res.data.status);
          setCurrentNote(res.data.note || '');
        } catch (err) {
          setError('Failed to fetch application details.');
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, applicationId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await api.put(`/admin/applications/${applicationId}`, {
        status: currentStatus,
        note: currentNote,
      });
      onClose(true); // Close and signal a refresh
    } catch (err) {
      setError('Failed to save update.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-dark-slate">
            Application Details
          </h3>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          {loading && <p>Loading details...</p>}
          {error && !isSaving && <p className="text-red-600 text-center">{error}</p>}
          
          {details && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: User & Loan Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-accent-orange">Applicant Details</h4>
                  <p><strong>Name:</strong> {details.name}</p>
                  <p><strong>Email:</strong> {details.email}</p>
                  <p><strong>Phone:</strong> {details.phone}</p>
                  <p><strong>Aadhar:</strong> {details.aadhar}</p>
                  <p><strong>PAN:</strong> {details.pan}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-orange">Loan Details</h4>
                  <p><strong>Loan Type:</strong> {details.loan_name}</p>
                  <p><strong>Amount Requested:</strong> ${Number(details.amount_required).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-orange">Bank Details</h4>
                  <p><strong>Account Name:</strong> {details.account_holder_name}</p>
                  <p><strong>Account Number:</strong> {details.account_number}</p>
                  <p><strong>IFSC Code:</strong> {details.ifsc_code}</p>
                </div>
              </div>

              {/* Right Column: Admin Actions */}
              <form onSubmit={handleSave} className="space-y-4">
                <h4 className="font-semibold text-accent-orange">Process Application</h4>
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                    Application Status
                  </label>
                  <select
                    id="status"
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-1">
                    Admin Note
                  </label>
                  <textarea
                    id="note"
                    rows="6"
                    placeholder="Add a processing note..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  ></textarea>
                </div>
                {error && isSaving && <p className="text-red-600 text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-accent-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-orange-dark transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Update'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailModal;