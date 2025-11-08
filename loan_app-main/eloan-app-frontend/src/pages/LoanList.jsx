// src/pages/LoanList.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import LoanApplicationModal from '../components/LoanApplicationModal';

// Detail Item with Icon
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/loans');
        setLoans(response.data);
      } catch (err) {
        setError('Failed to fetch loans. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Function to open the modal
  const handleApplyClick = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedLoan(null);
    setIsModalOpen(false);
  };

  // Loading State UI
  if (loading) return (
      <div className="flex justify-center items-center h-64">
          {/* Tailwind spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-green"></div>
      </div>
  );

  // Error State UI
  if (error) return (
      <div className="text-center p-8 text-red-700 bg-red-50 rounded-lg shadow border border-red-200">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p>{error}</p>
      </div>
  );

  // SVG Icons for cards (using inline SVG for simplicity, no extra dependencies)
  const InterestIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const AmountIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  const TenureIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    // Simple fade-in animation container
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Find Your Perfect Loan</h2>
        <p className="text-gray-500 mt-1">Explore our range of loan products tailored for you.</p>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loans.length === 0 ? (
          <p className="md:col-span-3 text-gray-500 text-center py-10">
            No loan products are available at the moment.
          </p>
        ) : (
          loans.map((loan, index) => (
            <div
              key={loan.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }} // Stagger animation
            >
              {/* Card Header with a colorful gradient accent */}
              <div className="p-6 bg-gradient-to-br from-green-50 via-white to-orange-50 relative border-b border-gray-100">
                 {/* Decorative corner element */}
                 <div className="absolute top-0 right-0 h-12 w-12 bg-accent-orange opacity-10 rounded-bl-full"></div>
                 <h3 className="text-xl font-bold text-primary-green relative z-10">
                  {loan.loan_name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 relative z-10 leading-relaxed">
                  {loan.description || "A flexible financing solution designed to meet your needs."}
                </p>
              </div>

              {/* Card Body with details */}
              <div className="p-6 flex-grow space-y-4">
                <DetailItem icon={InterestIcon} label="Interest Rate" value={`${loan.interest_rate}% p.a.`} />
                <DetailItem icon={AmountIcon} label="Loan Amount" value={`₹${Number(loan.min_amount).toLocaleString()} - ₹${Number(loan.max_amount).toLocaleString()}`} />
                <DetailItem icon={TenureIcon} label="Tenure" value={`${loan.tenure_months} months`} />
                 {/* Optionally display Processing Fee if it exists */}
                {loan.processing_fee_percent > 0 && (
                     <DetailItem 
                         icon={ <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
                         label="Processing Fee" 
                         value={`${loan.processing_fee_percent}%`} 
                     />
                 )}
              </div>

              {/* Card Footer - Apply Button */}
              <div className="p-6 mt-auto bg-gray-50/50 border-t border-gray-100">
                <button
                  onClick={() => handleApplyClick(loan)}
                  className="w-full bg-gradient-to-r from-accent-orange to-orange-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transform hover:scale-[1.03] transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center justify-center gap-2"
                >
                    Apply Now
                    {/* Arrow Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render Loan Application Modal */}
      {selectedLoan && (
        <LoanApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          loan={selectedLoan}
        />
      )}

      {/* Add keyframes for animation in index.css or a style tag */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        /* Apply fade-in to grid items for stagger effect */
        .animate-fade-in > div > div { opacity: 0; animation: fadeIn 0.5s ease-out forwards; animation-fill-mode: both; }
      `}</style>
    </div>
  );
}

export default LoanList;