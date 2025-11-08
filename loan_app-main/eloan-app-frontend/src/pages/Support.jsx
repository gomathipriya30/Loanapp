// src/pages/Support.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Loading Spinner Icon
const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function Support() {
  const [tickets, setTickets] = useState([]);
  const [loadingList, setLoadingList] = useState(true); // Separate loading for list
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Separate loading for submit
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState(''); // 'success' or 'error'

  const fetchTickets = async () => {
    try {
      setLoadingList(true);
      const res = await api.get('/support/my-tickets');
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      // Optionally set an error state for the list here
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setFormMessageType('');
    setLoadingSubmit(true); // Start submit loading
    try {
      await api.post('/support/create', { subject, message });
      setFormMessage('Ticket created successfully!');
      setFormMessageType('success');
      setSubject('');
      setMessage('');
      fetchTickets(); // Refresh list after successful submission
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Failed to create ticket.');
      setFormMessageType('error');
    } finally {
        setLoadingSubmit(false); // Stop submit loading
    }
  };

  const formMessageClass = formMessageType === 'success' ? 'text-green-600' : 'text-red-600';
  const labelStyles = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-10 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 pb-3 border-b border-gray-200">
        Support Center
      </h2>

      {/* New Ticket Form Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-5">Create a New Support Ticket</h3>
        {/* Input field styles */}
        <style>{`
            .input-field { display: block; width: 100%; padding: 0.65rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 0.2s ease-in-out; font-size: 0.875rem; }
            .input-field:focus { box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2); border-color: #27ae60; }
        `}</style>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className={labelStyles}>Subject</label>
            <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="input-field" placeholder="Briefly describe your issue"/>
          </div>
          <div>
            <label htmlFor="message" className={labelStyles}>Message</label>
            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows="5" className="input-field" placeholder="Please provide details about your request..."></textarea>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
                type="submit"
                disabled={loadingSubmit}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary-green text-white font-semibold rounded-lg shadow-sm hover:bg-primary-green-dark transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingSubmit ? <><SpinnerIcon /> Submitting...</> : 'Submit Ticket'}
            </button>
             {formMessage && <p className={`text-sm text-center font-medium ${formMessageClass}`}>{formMessage}</p>}
          </div>
        </form>
      </div>

      {/* Existing Tickets List Card */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-5">My Tickets</h3>
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {/* Use overflow-x-auto for smaller screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Subject</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium">Created On</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingList ? (
                  <tr><td colSpan="4" className="text-center p-6 text-gray-500">Loading tickets...</td></tr>
                ) : tickets.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-6 text-gray-500">You haven't created any support tickets yet.</td></tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                            to={`/dashboard/support/${ticket.id}`}
                            className="font-semibold text-accent-orange hover:text-orange-700 transition-colors duration-150"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Animation Style */}
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

export default Support;