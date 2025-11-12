// src/components/user/RepaymentScheduleModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

// Loading Spinner Icon
const SpinnerIcon = () => (
  <svg
    className="animate-spin h-8 w-8 text-primary-green"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

function RepaymentScheduleModal({ isOpen, onClose, applicationId }) {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (!applicationId) {
      setError('Missing application id.');
      return;
    }

    let mounted = true;
    const fetchSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(
          `/applications/my-applications/${applicationId}/schedule`
        );
        if (mounted) setScheduleData(res.data || null);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load repayment schedule.';
        if (mounted) setError(msg);
        console.error('Schedule fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSchedule();

    return () => {
      mounted = false;
    };
  }, [isOpen, applicationId]);

  const formatCurrency = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return '₹0.00';
    return `₹${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (input) => {
    if (!input) return '-';
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return '-';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateDates = (count = 0, startDate) => {
    const base = startDate ? new Date(startDate) : new Date();
    const baseDate = Number.isNaN(base.getTime()) ? new Date() : base;
    const dates = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(baseDate.getTime());
      d.setDate(baseDate.getDate() + (i + 1) * 10);
      dates.push(formatDate(d));
    }
    return dates;
  };

  if (!isOpen) return null;

  const scheduleArray = Array.isArray(scheduleData?.schedule)
    ? scheduleData.schedule
    : [];

  const startDate =
    scheduleData?.disbursedDate || scheduleData?.startDate || new Date();
  const dateList = generateDates(scheduleArray.length, startDate);

  // Dummy penalties (you can modify the pattern)
  const dummyPenalties = [150, 200, 250, 300, 350, 400, 450, 500];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
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

          {!loading && !error && scheduleArray.length === 0 && (
            <div className="text-center p-6 text-gray-600">
              No repayment schedule available.
            </div>
          )}

          {scheduleArray.length > 0 && !loading && !error && (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <span className="text-xs text-green-700 uppercase tracking-wider block">
                    Monthly EMI
                  </span>
                  <strong className="text-xl font-semibold text-primary-green block mt-1">
                    {formatCurrency(scheduleData?.emi)}
                  </strong>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                  <span className="text-xs text-orange-700 uppercase tracking-wider block">
                    Total Interest
                  </span>
                  <strong className="text-xl font-semibold text-accent-orange block mt-1">
                    {formatCurrency(scheduleData?.totalInterest)}
                  </strong>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 text-center">
                  <span className="text-xs text-gray-600 uppercase tracking-wider block">
                    Total Payment
                  </span>
                  <strong className="text-xl font-semibold text-gray-800 block mt-1">
                    {formatCurrency(scheduleData?.totalPayment)}
                  </strong>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-center">Month</th>
                      <th className="px-4 py-3 text-center">Date</th>
                      <th className="px-4 py-3 text-right">Principal Paid</th>
                      <th className="px-4 py-3 text-right">Interest Paid</th>
                      <th className="px-4 py-3 text-right">Penalty</th>
                      <th className="px-4 py-3 text-right">Total Payment</th>
                      <th className="px-4 py-3 text-center">Payment Link</th>
                      <th className="px-4 py-3 text-right">Remaining Balance</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {scheduleArray.map((row, index) => {
                      const key = row?.month ?? index;
                      const paymentHref =
                        row?.paymentLink && typeof row.paymentLink === 'string'
                          ? row.paymentLink
                          : '#';

                      // Use dummy penalty if not available
                      const penalty =
                        row?.penalty ??
                        dummyPenalties[index % dummyPenalties.length];

                      return (
                        <tr
                          key={key}
                          className="bg-white hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="px-4 py-2 text-center font-medium text-gray-900">
                            {row?.month ?? `#${index + 1}`}
                          </td>

                          <td className="px-4 py-2 text-center text-gray-600">
                            {dateList[index] ?? '-'}
                          </td>

                          <td className="px-4 py-2 text-right text-gray-600">
                            {formatCurrency(row?.principalPayment)}
                          </td>

                          <td className="px-4 py-2 text-right text-gray-600">
                            {formatCurrency(row?.interestPayment)}
                          </td>

                          {/* New Penalty Column */}
                          <td className="px-4 py-2 text-right text-gray-600">
                            {formatCurrency(penalty)}
                          </td>

                          <td className="px-4 py-2 text-right font-semibold text-gray-800">
                            {formatCurrency(row?.totalPayment)}
                          </td>

                          {/* Pay Now Button */}
                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-center">
                              <a
                                href={paymentHref}
                                target={paymentHref === '#' ? '_self' : '_blank'}
                                rel={
                                  paymentHref === '#'
                                    ? undefined
                                    : 'noopener noreferrer'
                                }
                                className="inline-block px-3 py-1 text-xs sm:text-sm font-semibold text-white bg-primary-green rounded-lg hover:bg-green-600 transition-colors duration-150 whitespace-nowrap"
                                onClick={(e) => {
                                  if (paymentHref === '#') e.preventDefault();
                                }}
                                aria-label={`Pay now for month ${
                                  row?.month ?? index + 1
                                }`}
                              >
                                Pay Now
                              </a>
                            </div>
                          </td>

                          <td className="px-4 py-2 text-right text-gray-600">
                            {formatCurrency(row?.balance)}
                          </td>
                        </tr>
                      );
                    })}
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

