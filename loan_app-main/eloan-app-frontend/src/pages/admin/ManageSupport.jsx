// src/pages/admin/ManageSupport.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function ManageSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/tickets/${id}/status`, { status: newStatus });
      fetchTickets(); // Refresh list
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">
        Manage Support Tickets
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading tickets...</td></tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{ticket.user_name}</td>
                  <td className="px-6 py-4">{ticket.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <Link to={`/admin/dashboard/support/${ticket.id}`} className="font-medium text-accent-orange hover:underline">
                      View
                    </Link>
                    {ticket.status === 'open' ? (
                      <button onClick={() => handleStatusChange(ticket.id, 'closed')} className="font-medium text-red-600 hover:underline">
                        Close
                      </button>
                    ) : (
                      <button onClick={() => handleStatusChange(ticket.id, 'open')} className="font-medium text-green-600 hover:underline">
                        Re-open
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageSupport;