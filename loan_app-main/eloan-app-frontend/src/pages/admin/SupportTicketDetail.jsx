// src/pages/admin/SupportTicketDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

// This is almost identical to the user's TicketDetail.jsx
// In a large app, you'd make a reusable <TicketConversation /> component
function SupportTicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/support/tickets/${id}`); // Admin has access
      setTicket(res.data.ticket);
      setReplies(res.data.replies);
    } catch (err) {
      setError('Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/support/tickets/${id}/reply`, { message: replyMessage }); // Admin has access
      setReplyMessage('');
      fetchTicket(); // Refresh replies
    } catch (err) {
      setError('Failed to post reply.');
    }
  };
  
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div>
      <Link to="/admin/dashboard/support" className="text-accent-orange hover:underline mb-4 block">&larr; Back to all tickets</Link>
      <h2 className="text-3xl font-bold text-dark-slate mb-2">
        {ticket.subject}
      </h2>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {ticket.status}
      </span>

      {/* Conversation Thread */}
      <div className="space-y-4 mt-6">
        {/* Original Message */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm font-semibold text-gray-700">User said on {new Date(ticket.created_at).toLocaleString()}</p>
          <p className="mt-2">{ticket.message}</p>
        </div>
        
        {/* Replies */}
        {replies.map((reply) => (
          <div key={reply.id} className={`p-4 rounded-lg shadow-sm ${reply.replier_role === 'admin' ? 'bg-green-50 border border-green-200' : 'bg-white border'}`}>
            <p className="text-sm font-semibold text-gray-700">
              {reply.replier_role === 'admin' ? `${reply.replier_name} (Support)` : 'User'}
              <span className="font-normal text-gray-500"> on {new Date(reply.created_at).toLocaleString()}</span>
            </p>
            <p className="mt-2">{reply.message}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {ticket.status === 'open' && (
        <form onSubmit={handleReply} className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Post a Reply (as Admin)</h3>
          <textarea
            rows="4"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"
            placeholder="Type your reply..."
          ></textarea>
          <button type="submit" className="mt-2 px-6 py-2 bg-accent-orange text-white font-bold rounded-lg hover:bg-accent-orange-dark">
            Send Reply
          </button>
        </form>
      )}
    </div>
  );
}

export default SupportTicketDetail;