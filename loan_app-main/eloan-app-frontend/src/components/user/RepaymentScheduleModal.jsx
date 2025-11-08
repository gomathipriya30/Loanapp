// src/components/user/RepaymentScheduleModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

// Loading Spinner Icon
const SpinnerIcon = () => (
    <svg className="animate-spin h-8 w-8 text-primary-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function RepaymentScheduleModal({ isOpen, onClose, applicationId }) {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && applicationId) {
      const fetchSchedule = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await api.get(`/applications/my-applications/${applicationId}/schedule`);
          setScheduleData(res.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load repayment schedule.');
          console.error("Schedule fetch error:", err); // Log error
        } finally {
          setLoading(false);
        }
      };
      fetchSchedule();
    }
  }, [isOpen, applicationId]); // Rerun effect if modal opens or ID changes

  // Helper for formatting currency
  const formatCurrency = (value) => value ? `₹${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₹0.00';


  if (!isOpen) return null; // Don't render if not open

  return (
    // Backdrop with fade-in effect
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      {/* Modal Content with animation */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">
            Loan Repayment Schedule
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-150 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
           >
             {/* Close Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable Table) */}
        <div className="p-6 overflow-y-auto flex-grow">
          {loading && (
             <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <SpinnerIcon />
                <p className="mt-2 text-sm">Loading schedule...</p>
             </div>
          )}
          {error && (
             <div className="text-center p-6 text-red-700 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold">Could not load schedule.</p>
                <p>{error}</p>
             </div>
          )}

          {scheduleData && !loading && !error && (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <span className="text-xs text-green-700 uppercase tracking-wider block">Monthly EMI</span>
                  <strong className="text-xl font-semibold text-primary-green block mt-1">{formatCurrency(scheduleData.emi)}</strong>
                </div>
                 <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                  <span className="text-xs text-orange-700 uppercase tracking-wider block">Total Interest</span>
                  <strong className="text-xl font-semibold text-accent-orange block mt-1">{formatCurrency(scheduleData.totalInterest)}</strong>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 text-center">
                  <span className="text-xs text-gray-600 uppercase tracking-wider block">Total Payment</span>
                  <strong className="text-xl font-semibold text-gray-800 block mt-1">{formatCurrency(scheduleData.totalPayment)}</strong>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium text-center w-16">Month</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">Principal Paid</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">Interest Paid</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">Total Payment</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scheduleData.schedule.map((row) => (
                      <tr key={row.month} className="bg-white hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-4 py-2 font-medium text-gray-900 text-center">{row.month}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(row.principalPayment)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(row.interestPayment)}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-800">{formatCurrency(row.totalPayment)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 text-right flex-shrink-0">
             <button
                onClick={onClose}
                className="px-5 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Close
             </button>
        </div>
      </div>
      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes scaleIn { 
          from { opacity: 0; transform: scale(0.95); } 
          to { opacity: 1; transform: scale(1); } 
        }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default RepaymentScheduleModal;