// src/pages/EMICalculator.jsx
import React, { useState, useEffect } from 'react';

function EMICalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(24);
  const [emi, setEmi] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [totalPayment, setTotalPayment] = useState('');

  // Calculate EMI whenever inputs change
  useEffect(() => {
    calculateEMI();
  }, [amount, rate, tenure]);

  const calculateEMI = () => {
    // Basic validation
    if (!amount || !rate || !tenure || amount <= 0 || rate <= 0 || tenure <= 0) {
      setEmi(''); setTotalInterest(''); setTotalPayment('');
      return;
    }
    const principal = parseFloat(amount);
    const monthlyRate = parseFloat(rate) / (12 * 100);
    const months = parseFloat(tenure);

    // EMI Formula
    const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPaymentValue = emiValue * months;
    const totalInterestValue = totalPaymentValue - principal;

    // Set state, ensuring values are valid numbers before formatting
    setEmi(isNaN(emiValue) ? '' : emiValue.toFixed(2));
    setTotalInterest(isNaN(totalInterestValue) ? '' : totalInterestValue.toFixed(2));
    setTotalPayment(isNaN(totalPaymentValue) ? '' : totalPaymentValue.toFixed(2));
  };

  // Helper for formatting currency
  const formatCurrency = (value) => value ? `₹${Number(value).toLocaleString()}` : '₹0';

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-3 border-b border-gray-200">
        Loan EMI Calculator
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-5">Enter Loan Details</h3>
          {/* Shared input styles */}
          <style>{`
            .input-field { width: 100%; padding: 0.75rem 1rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 0.2s ease-in-out; font-size: 0.875rem; } 
            .input-field:focus { box-shadow: 0 0 0 2px #27ae60; border-color: #27ae60; }
            .range-slider { width: 100%; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; appearance: none; cursor: pointer; margin-top: 0.5rem; }
            .range-slider::-webkit-slider-thumb { appearance: none; width: 1rem; height: 1rem; background-color: #27ae60; border-radius: 50%; cursor: pointer; }
            .range-slider::-moz-range-thumb { width: 1rem; height: 1rem; background-color: #27ae60; border-radius: 50%; cursor: pointer; border: none; }
          `}</style>
          <div className="space-y-6"> {/* Increased spacing */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">
                Loan Amount (<span className="font-semibold text-gray-800">{formatCurrency(amount)}</span>)
              </label>
              <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field"/>
              {/* Slider with updated styling */}
              <input type="range" min="1000" max="1000000" step="1000" value={amount} onChange={(e) => setAmount(e.target.value)} className="range-slider"/>
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-600 mb-1">
                Annual Interest Rate (<span className="font-semibold text-gray-800">{rate}%</span>)
              </label>
              <input type="number" step="0.1" id="rate" value={rate} onChange={(e) => setRate(e.target.value)} className="input-field"/>
              <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="range-slider"/>
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-600 mb-1">
                Tenure (<span className="font-semibold text-gray-800">{tenure} months</span>)
              </label>
              <input type="number" id="tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} className="input-field"/>
              <input type="range" min="6" max="120" step="1" value={tenure} onChange={(e) => setTenure(e.target.value)} className="range-slider"/>
            </div>
          </div>
        </div>

        {/* Results Display Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary-green to-green-700 p-8 rounded-xl shadow-lg text-white flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-semibold mb-2 opacity-90">Your Estimated Monthly EMI</h3>
            <p className="text-5xl font-bold mb-6 tracking-tight">{formatCurrency(emi)}</p>
            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-black bg-opacity-20 p-5 rounded-lg backdrop-blur-sm">
                <div>
                    <p className="text-sm opacity-80 mb-0.5">Total Interest</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalInterest)}</p>
                </div>
                 <div>
                    <p className="text-sm opacity-80 mb-0.5">Total Payment</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalPayment)}</p>
                </div>
            </div>
            <p className="text-xs opacity-70 mt-6">*Estimates only. Actual values may vary.</p>
        </div>
      </div>
      {/* Animation Style */}
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

export default EMICalculator;