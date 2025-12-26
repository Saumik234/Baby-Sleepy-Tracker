import React, { useState, useEffect } from 'react';

interface AuthProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in on mount
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish before calling parent
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form validation and API calls here.
    // For this demo, we'll just call the success handler with animation.
    setIsVisible(false);
    setTimeout(onLoginSuccess, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={handleClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 transform transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-end">
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{isLoginView ? 'Welcome Back!' : 'Create Your Account'}</h2>
            <p className="text-gray-500 mt-2">{isLoginView ? 'Log in to continue your journey.' : 'Join us to start tracking.'}</p>
        </div>

        <div className="flex border border-gray-200 rounded-full p-1 mb-6">
            <button onClick={() => setIsLoginView(true)} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${isLoginView ? 'bg-[#A18AFF] text-white' : 'text-gray-600'}`}>
                Login
            </button>
            <button onClick={() => setIsLoginView(false)} className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${!isLoginView ? 'bg-[#A18AFF] text-white' : 'text-gray-600'}`}>
                Sign Up
            </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {!isLoginView && (
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" required className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0" />
                    </div>
                )}
                 <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" required className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0" />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" required className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0" />
                </div>
                 {!isLoginView && (
                    <div>
                        <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" id="confirm-password" required className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0" />
                    </div>
                )}
            </div>
            <button type="submit" className="w-full bg-[#FFB3C1] text-gray-800 font-semibold px-8 py-3 rounded-full hover:bg-[#ff9cb0] transition-transform duration-300 transform hover:scale-105 shadow-lg mt-8">
                {isLoginView ? 'Login' : 'Create Account'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;