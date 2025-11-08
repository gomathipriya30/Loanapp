// src/pages/admin/EditLoan.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';

function EditLoan() {
  const [formData, setFormData] = useState({
    loan_name: '', description: '', interest_rate: '', processing_fee_percent: '',
    max_amount: '', min_amount: '', tenure_months: '',
    required_docs: '', eligibility_info: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/loans/${id}`);
        // Pre-fill form, handling potential null values
        setFormData({
          loan_name: response.data.loan_name || '',
          description: response.data.description || '',
          interest_rate: response.data.interest_rate || '',
          processing_fee_percent: response.data.processing_fee_percent || '',
          max_amount: response.data.max_amount || '',
          min_amount: response.data.min_amount || '',
          tenure_months: response.data.tenure_months || '',
          required_docs: response.data.required_docs || '',
          eligibility_info: response.data.eligibility_info || '',
        });
      } catch (err) {
        setMessage('Failed to load loan data.'); setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchLoan();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setMessageType('');
    try {
      const response = await api.put(`/admin/loans/${id}`, formData);
      setMessage(response.data.message); setMessageType('success');
      setTimeout(() => navigate('/admin/dashboard/loans'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update loan.');
      setMessageType('error');
    }
  };
  
  const messageClass = messageType === 'success' ? 'text-green-600' : 'text-red-600';

  if (loading) return <p>Loading loan data...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-slate mb-6 pb-2 border-b-2 border-gray-200">Edit Loan</h2>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
       <style>{`.input-field { width: 100%; padding: 0.5rem 1rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; outline: none; } .input-field:focus { box-shadow: 0 0 0 2px #E67E22; border-color: #E67E22; }`}</style>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="loan_name" className="label">Loan Name *</label>
              <input type="text" id="loan_name" value={formData.loan_name} onChange={handleChange} required className="input-field"/>
            </div>
            <div>
              <label htmlFor="interest_rate" className="label">Interest Rate (%) *</label>
              <input type="number" step="0.01" id="interest_rate" value={formData.interest_rate} onChange={handleChange} required className="input-field"/>
            </div>
             <div>
              <label htmlFor="processing_fee_percent" className="label">Processing Fee (%)</label>
              <input type="number" step="0.01" id="processing_fee_percent" value={formData.processing_fee_percent} onChange={handleChange} className="input-field"/>
            </div>
             <div>
              <label htmlFor="tenure_months" className="label">Tenure (Months) *</label>
              <input type="number" id="tenure_months" value={formData.tenure_months} onChange={handleChange} required className="input-field"/>
            </div>
             <div>
              <label htmlFor="min_amount" className="label">Min Amount (₹) *</label>
              <input type="number" step="100" id="min_amount" value={formData.min_amount} onChange={handleChange} required className="input-field"/>
            </div>
            <div>
              <label htmlFor="max_amount" className="label">Max Amount (₹) *</label>
              <input type="number" step="100" id="max_amount" value={formData.max_amount} onChange={handleChange} required className="input-field"/>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" value={formData.description} onChange={handleChange} rows="3" className="input-field"></textarea>
          </div>
          <div>
            <label htmlFor="required_docs" className="label">Required Documents (comma-separated)</label>
            <input type="text" id="required_docs" value={formData.required_docs} onChange={handleChange} className="input-field" placeholder="e.g., PAN Card, Aadhar Card, Salary Slip"/>
          </div>
          <div>
            <label htmlFor="eligibility_info" className="label">Eligibility Info</label>
            <textarea id="eligibility_info" value={formData.eligibility_info} onChange={handleChange} rows="3" className="input-field" placeholder="e.g., Minimum Salary: $2000/month, Age: 21-60"></textarea>
          </div>

          {message && <p className={`text-sm text-center font-semibold ${messageClass}`}>{message}</p>}
          <div className="flex gap-4 items-center">
             <button type="submit" className="px-6 py-2 bg-accent-orange text-white font-bold rounded-lg hover:bg-accent-orange-dark">Update Loan</button>
             <Link to="/admin/dashboard/loans" className="font-medium text-gray-600 hover:text-dark-slate">
                Cancel
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add a simple label style helper
const label = "block text-sm font-semibold text-gray-700 mb-1"; 

export default EditLoan;