// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground'; // Ensure this component is in src/components

function LandingPage() {
  const [navBackground, setNavBackground] = useState(false);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBackground(true);
      } else {
        setNavBackground(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // ADDED `select-none` to prevent the text cursor from appearing on click
    <div className="min-h-screen bg-[#111827] text-gray-100 font-poppins relative select-none">
      <ParticlesBackground /> {/* Dynamic particles background */}

      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${navBackground ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <img src="/logo2.png" alt="Conzura Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200 hidden md:block">How It Works</a>
            <a href="#products" className="text-gray-300 hover:text-white transition-colors duration-200 hidden md:block">Loans</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 hidden md:block">Testimonials</a>
            <Link to="/login" className="px-5 py-2 border border-primary-green text-primary-green rounded-lg hover:bg-primary-green hover:text-white transition-all duration-300 font-semibold">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 bg-accent-orange text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20 pb-10 overflow-hidden">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <span className="block text-primary-green text-3xl md:text-5xl font-bold mb-2">Fast. Flexible. Yours.</span>
          Your Financial Journey, <br className="hidden sm:inline"/> Starts Here.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          Access the funds you need with ease. Conzura offers quick approvals and plans tailored for you.
        </p>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse-slow hidden lg:block">
            <svg className="h-48 w-48 text-accent-orange/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        </div>
        
        <Link 
          to="/register" 
          className="relative z-20 bg-primary-green text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" 
          style={{ animationDelay: '700ms' }}
        >
          Apply for a Loan
        </Link>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white tracking-tight mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Simple Steps to Your Loan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 px-20">
              <div className="h-0.5 bg-gradient-to-r from-primary-green via-green-500 to-accent-orange opacity-40"></div>
            </div>
            
            <div className="relative flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14v4m-2 2h4"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">1. Apply Online</h3>
              <p className="text-gray-400">Fill out our quick and easy application form in minutes.</p>
            </div>
            <div className="relative flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16h.01"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">2. Get Approved</h3>
              <p className="text-gray-400">Receive a decision on your loan application almost instantly.</p>
            </div>
            <div className="relative flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">3. Receive Funds</h3>
              <p className="text-gray-400">Funds are deposited directly into your bank account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Loan Products Section */}
      <section id="products" className="relative z-10 py-20 bg-[#111827]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white tracking-tight mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Our Flexible Loan Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-primary-green transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="text-primary-green mb-4">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0h.01M9 12h6m-5 0h.01M9 16h6m-5 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Personal Loans</h3>
              <p className="text-gray-400 mb-4">Unsecured loans for personal expenses, debt consolidation, or unexpected costs.</p>
              <Link to="/register" className="text-accent-orange font-medium hover:text-orange-600 group-hover:underline transition-colors duration-200">
                Apply Now &rarr;
              </Link>
            </div>
            <div className="bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-accent-orange transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="text-accent-orange mb-4">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.564 23.564 0 0112 15c-3.183 0-6.22-1.2-8.455-3.245m16.91 0c.935 0 1.77.202 2.378.573a.75.75 0 01.372 1.006l-.04.148a.75.75 0 01-.655.511l-.64-.176a.75.75 0 01-.61.93L19.26 16m-12.7-1.39l-1.605-2.006c-.886-.665-2.227-.247-2.227.973v2.185c0 .762.593 1.385 1.342 1.545l.937.197M12 10.75V3m0 0l-3 3m3-3l3 3m-3 10.25a.75.75 0 01-.75-.75V15a.75.75 0 01.75-.75h.008c.414 0 .75.336.75.75v1.5a.75.75 0 01-.75.75H12z"/></svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Business Loans</h3>
              <p className="text-gray-400 mb-4">Capital to grow your business, manage cash flow, or invest in new ventures.</p>
              <Link to="/register" className="text-primary-green font-medium hover:text-green-600 group-hover:underline transition-colors duration-200">
                Explore Options &rarr;
              </Link>
            </div>
            <div className="bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400 transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="text-blue-400 mb-4">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 0h3m-3 0V5m1 2V5m7 12h2m-2 0h-2M12 21V9" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Home Loans</h3>
              <p className="text-gray-400 mb-4">Realize your dream of homeownership with our competitive mortgage rates.</p>
              <Link to="/register" className="text-accent-orange font-medium hover:text-orange-600 group-hover:underline transition-colors duration-200">
                Find Your Home &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Customers Say Section */}
      <section id="testimonials" className="relative z-10 py-20 bg-gray-900/70 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white tracking-tight mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-primary-green transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="text-lg italic text-gray-300 mb-4 leading-relaxed">"Conzura made getting a personal loan incredibly simple. The process was fast, and the terms were clear. Highly recommended!"</p>
              <p className="font-semibold text-white">- Jane Doe</p>
              <p className="text-sm text-gray-500">Marketing Manager</p>
            </div>
            <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-accent-orange transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <p className="text-lg italic text-gray-300 mb-4 leading-relaxed">"As a small business owner, finding quick capital is crucial. Conzura delivered, allowing me to expand my operations smoothly."</p>
              <p className="font-semibold text-white">- John Smith</p>
              <p className="text-sm text-gray-500">Small Business Owner</p>
            </div>
            <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <p className="text-lg italic text-gray-300 mb-4 leading-relaxed">"The EMI calculator helped me plan my finances perfectly. It's a great tool, and the loan application was a breeze!"</p>
              <p className="font-semibold text-white">- Emily White</p>
              <p className="text-sm text-gray-500">Freelance Designer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="relative z-10 py-20 bg-primary-green/90 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Join thousands of satisfied customers who have achieved their financial goals with Conzura.
            It's time to make your money work for you.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-primary-green text-xl font-bold px-12 py-5 rounded-full shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" 
            style={{ animationDelay: '500ms' }}
          >
            Start Your Application Today!
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 bg-gray-950 text-gray-400 py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Conzura</h3>
            <p className="text-sm">Your trusted partner for quick and flexible financial solutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a></li>
              <li><a href="#products" className="hover:text-white transition-colors duration-200">Our Loans</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors duration-200">Testimonials</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
            <p className="text-sm">123 Loan Street, Financial City, FC 00000</p>
            <p className="text-sm mt-1">support@conzura.com</p>
            <p className="text-sm mt-1">+1 (800) 123-4567</p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
          <p>&copy; {new Date().getFullYear()} Conzura. All rights reserved.</p>
        </div>
      </footer>

      {/* Global Styles: Font Import and Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
          opacity: 0;
          animation-fill-mode: both;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;

