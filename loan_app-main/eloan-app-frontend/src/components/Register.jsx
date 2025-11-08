import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Use the custom api instance

// Self-contained SVG icon for the loading spinner
const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Reusable Floating Label Input Component
const FloatingLabelInput = ({ id, type, value, onChange, placeholder, animationDelay }) => (
  <div className="relative animate-fade-in-up" style={{ animationDelay }}>
    <input
      type={type}
      id={id}
      className="peer block w-full px-3 py-3 bg-gray-800/50 text-white placeholder-transparent rounded-lg border border-gray-600 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
    <label
      htmlFor={id}
      className="absolute left-3 -top-2.5 text-gray-400 text-xs transition-all
                 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3
                 peer-focus:-top-2.5 peer-focus:text-accent-orange peer-focus:text-xs"
    >
      {placeholder}
    </label>
  </div>
);


function Register() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', aadhar: '', pan: '',
    occupation: '', organization: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Effect for the interactive background spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      const spotlight = document.getElementById('spotlight');
      if (spotlight) {
        spotlight.style.background = `radial-gradient(600px at ${e.pageX}px ${e.pageY}px, rgba(45, 212, 191, 0.1), transparent 80%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    const { confirmPassword, ...dataToSend } = formData;
    try {
      await api.post('/auth/register', dataToSend);
      alert('Registration successful! Please proceed to login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 bg-[#111827] text-gray-300 overflow-hidden relative">
      {/* Interactive Spotlight Effect */}
      <div id="spotlight" className="absolute inset-0 z-0 transition-all duration-300"></div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#1F2937]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">
        
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <svg className="h-10 w-auto text-primary-green mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-gray-400 text-sm mt-1">Join e-Loan today. It's fast and secure.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6" onSubmit={handleSubmit}>
          <FloatingLabelInput id="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" animationDelay="200ms" />
          <FloatingLabelInput id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" animationDelay="250ms" />
          <div className="md:col-span-2"><FloatingLabelInput id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" animationDelay="300ms" /></div>
          <FloatingLabelInput id="aadhar" type="text" value={formData.aadhar} onChange={handleChange} placeholder="Aadhar Number" animationDelay="350ms" />
          <FloatingLabelInput id="pan" type="text" value={formData.pan} onChange={handleChange} placeholder="PAN Number" animationDelay="400ms" />
          <FloatingLabelInput id="occupation" type="text" value={formData.occupation} onChange={handleChange} placeholder="Occupation" animationDelay="450ms" />
          <FloatingLabelInput id="organization" type="text" value={formData.organization} onChange={handleChange} placeholder="Organization (Optional)" animationDelay="500ms" />
          <FloatingLabelInput id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" animationDelay="550ms" />
          <FloatingLabelInput id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" animationDelay="600ms" />
          
          {error && <p className="md:col-span-2 text-sm text-center text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}
          
          <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '650ms' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-orange text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <SpinnerIcon /> : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent-orange hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

export default Register;

