import React, { useState, useEffect } from 'react';
import { Mic, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, forgotPassword, isLoading } = useAppStore();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Get email from navigation state or redirect back
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/auth/forgot-password');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    const result = await verifyOTP(email, otp);
    
    if (result.success) {
      toast.success('OTP verified successfully!');
      navigate('/auth/reset-password', { 
        state: { 
          resetToken: result.data.resetToken,
          email 
        } 
      });
    } else {
      toast.error(result.message);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    const result = await forgotPassword(email);
    
    if (result.success) {
      toast.success('New OTP sent to your email!');
      setOtp(''); // Clear current OTP
    } else {
      toast.error(result.message);
    }
    setResendLoading(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-left-5 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
        <p className="text-gray-600">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleOtpChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500 text-center text-2xl font-mono tracking-widest"
            maxLength={6}
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
            'Verify OTP'
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/auth/forgot-password')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;