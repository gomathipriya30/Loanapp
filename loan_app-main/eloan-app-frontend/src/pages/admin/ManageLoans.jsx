import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function ManageLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLoans = async () => {
    try {
      setLoading(true);
      // NOTE: The backend route is /api/admin/loans
      const response = await api.get('/admin/loans');
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch loans.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await api.delete(`/admin/loans/${id}`);
        fetchLoans(); // Refresh the list
      } catch (err) {
        setError('Failed to delete loan.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading loans...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-dark-slate">Manage Loans</h2>
        {/* THIS IS THE CORRECTED LINK */}
        <Link
          to="/admin/dashboard/loans/add"
          className="px-4 py-2 bg-primary-green text-white font-bold rounded-lg hover:bg-primary-green-dark transition-colors duration-300"
        >
          + Add New Loan
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Loan Name</th>
              <th scope="col" className="px-6 py-3">Interest Rate</th>
              <th scope="col" className="px-6 py-3">Max Amount</th>
              <th scope="col" className="px-6 py-3">Tenure</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{loan.loan_name}</td>
                <td className="px-6 py-4">{loan.interest_rate}%</td>
                <td className="px-6 py-4">${Number(loan.max_amount).toLocaleString()}</td>
                <td className="px-6 py-4">{loan.tenure_months} months</td>
                <td className="px-6 py-4 flex gap-2">
                  <Link
                    to={`/admin/dashboard/loans/${loan.id}/edit`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageLoans;
