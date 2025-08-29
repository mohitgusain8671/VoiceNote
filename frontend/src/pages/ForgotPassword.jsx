import React, { useState } from 'react';
import { Mail, Mic, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAppStore();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const result = await forgotPassword(email);
    
    if (result.success) {
      toast.success('OTP sent to your email!');
      navigate('/auth/verify-otp', { state: { email } });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-left-5 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-gray-600">Enter your email to receive a reset code</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:cursor-pointer flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Send Reset Code'
          )}
        </button>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/auth/sign-in')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;