// src/pages/MyLoans.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import RepaymentScheduleModal from '../components/user/RepaymentScheduleModal';

// --- Redesigned Status Tracker Component ---
const StatusTracker = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'Submitted' },
    { id: 'processing', label: 'Processing' },
    { id: 'accepted-not-disbursed', label: 'Approved' },
    { id: 'accepted-disbursed', label: 'Disbursed' },
  ];

  if (status === 'rejected') {
    return (
      <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold text-sm text-red-700">Application Rejected</span>
      </div>
    );
  }

  let currentIndex = steps.findIndex(step => step.id === status);
  if (status === 'accepted-disbursed') { currentIndex = steps.length; } // All steps complete

  return (
    <div className="flex items-start w-full mt-2 space-x-2 md:space-x-4 overflow-x-auto py-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-shrink-0 min-w-[70px] relative"> {/* Added relative positioning */}
          {/* Step Circle/Icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              index < currentIndex ? 'bg-primary-green border-primary-green text-white' :
              index === currentIndex ? 'border-primary-green bg-green-50 text-primary-green animate-pulse' :
              'border-gray-300 bg-gray-100 text-gray-400'
            }`}>
            {index < currentIndex ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <span className="text-xs font-bold">{index + 1}</span>
            )}
          </div>
          {/* Label */}
          <p className={`text-xs mt-1.5 text-center ${
            index <= currentIndex ? 'font-medium text-primary-green' : 'text-gray-500'
          }`}>
            {step.label}
          </p>
          {/* Connector Line (using absolute positioning within the relative parent) */}
          {index < steps.length - 1 && (
            <div className={`absolute top-4 left-1/2 w-full h-0.5 transform -translate-x-1/2 ${
              index < currentIndex ? 'bg-primary-green' : 'bg-gray-300'
            }`} style={{ zIndex: -1, left: 'calc(50% + 20px)', width: 'calc(100% - 40px)' }}></div>
          )}
        </div>
      ))}
      {/* Invisible element to ensure container respects spacing */}
      <div className="flex-shrink-0 w-0"></div>
    </div>
  );
};
// --- End of Status Tracker Component ---

function MyLoans() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch (err) {
        setError('Failed to fetch your loan applications.');
        console.error(err); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  const handleViewSchedule = (app) => {
    setSelectedAppForSchedule(app);
    setShowScheduleModal(true);
  };

  if (loading) return (
      <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
  );

  if (error) return (
      <div className="text-center p-6 text-red-700 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold">Could not load applications.</p>
          <p>{error}</p>
      </div>
  );


  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-3 border-b border-gray-200">
        My Loan Applications
      </h2>
      {applications.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-gray-500">You haven't applied for any loans yet.</p>
            <p className="text-sm text-gray-400 mt-1">Explore available loans to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow overflow-hidden border border-gray-200 transition-shadow hover:shadow-lg">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-primary-green">{app.loan_name}</h3>
                  <p className="text-sm text-gray-500">
                    Amount: <strong className="text-gray-700">${Number(app.amount_required).toLocaleString()}</strong>
                    <span className="mx-2 text-gray-300">|</span>
                    Submitted: <strong className="text-gray-700">{new Date(app.created_at).toLocaleDateString()}</strong>
                  </p>
                </div>
                 {/* Status Badge */}
                 {app.status !== 'rejected' && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'accepted-not-disbursed' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'accepted-disbursed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {app.status.replace('-', ' ')}
                    </span>
                 )}
              </div>

              {/* Card Body - Status Tracker */}
              <div className="p-5">
                <StatusTracker status={app.status} />
              </div>

              {/* View Schedule Button or Admin Note */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                 {app.status === 'accepted-disbursed' ? (
                   <button
                     onClick={() => handleViewSchedule(app)}
                     className="w-full sm:w-auto text-sm font-semibold text-accent-orange hover:text-orange-700 transition-colors duration-200 flex items-center gap-1 mx-auto sm:mx-0"
                   >
                       View Repayment Schedule
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                   </button>
                 ) : (
                   <div>
                       <span className="text-gray-500 block text-xs font-semibold uppercase tracking-wider">Admin Note</span>
                       <p className="text-gray-700 italic mt-1 text-sm">
                           {app.note || (app.status === 'rejected' ? 'See rejection details if provided.' : 'No note from admin yet.')}
                       </p>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Schedule Modal */}
      {selectedAppForSchedule && (
        <RepaymentScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          applicationId={selectedAppForSchedule.id}
        />
      )}

      {/* Simple fade-in animation style */}
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

export default MyLoans;