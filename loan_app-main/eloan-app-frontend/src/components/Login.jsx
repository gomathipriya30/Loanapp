// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// Self-contained SVG icon for the loading spinner
const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { emailOrPhone, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#111827] text-gray-300 overflow-hidden relative">
      {/* Interactive Spotlight Effect */}
      <div id="spotlight" className="absolute inset-0 z-0 transition-all duration-300"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1F2937]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">

        {/* Logo and Title with staggered animation */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* *** ADDED LOGO HERE *** */}
            <img
              src="/logo2.png" // Assumes logo2.png is in the 'public' folder
              alt="Conzura Logo"
              className="h-12 w-auto mx-auto mb-4" // Adjust height (h-12) as needed
            />
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Securely log in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Floating Label Input for Email/Phone */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <input
              type="text"
              id="emailOrPhone"
              className="peer block w-full px-3 py-3 bg-gray-800/50 text-white placeholder-transparent rounded-lg border border-gray-600 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Email or Phone"
              required
            />
            <label
              htmlFor="emailOrPhone"
              className="absolute left-3 -top-2.5 text-gray-400 text-xs transition-all
                         peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3
                         peer-focus:-top-2.5 peer-focus:text-accent-orange peer-focus:text-xs"
            >
              Email or Phone Number
            </label>
          </div>

          {/* Floating Label Input for Password */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <input
              type="password"
              id="password"
              className="peer block w-full px-3 py-3 bg-gray-800/50 text-white placeholder-transparent rounded-lg border border-gray-600 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2.5 text-gray-400 text-xs transition-all
                         peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3
                         peer-focus:-top-2.5 peer-focus:text-accent-orange peer-focus:text-xs"
            >
              Password
            </label>
          </div>

          {error && <p className="text-sm text-center text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}

          {/* Animated Login Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-orange text-white font-bold py-3 px-4 rounded-lg
                         shadow-lg shadow-orange-500/20
                         hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30
                         transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <SpinnerIcon /> : 'Login Securely'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-3 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-accent-orange hover:underline">
                    Register here
                </Link>
            </p>
            {/* <p className="text-xs text-gray-500">
                <Link to="/admin/login" className="hover:underline">
                    Switch to Admin Login
                </Link>
            </p> */}
        </div>
      </div>

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0; /* Start hidden */
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

export default Login;