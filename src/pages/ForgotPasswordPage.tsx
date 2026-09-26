import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Eye, EyeOff, Loader2, ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const passwordReqs = {
    length: newPassword.length >= 8,
    lowercase: /[a-z]/.test(newPassword),
    uppercase: /[A-Z]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordReqs).every(Boolean);
  const doPasswordsMatch = newPassword !== '' && newPassword === confirmPassword;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      if (forgotPassword) {
        await forgotPassword(email);
      }
      // Mocking OTP sent
      setMessage('OTP sent to your email');
      setTimeout(() => {
        setMessage('');
        setStep(2);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || !isPasswordValid || !doPasswordsMatch) {
      setError('Please fill all fields correctly');
      return;
    }

    if (otp !== '123456') {
      setError('Invalid OTP. Use 123456 for testing.');
      return;
    }

    setIsLoading(true);
    try {
      if (resetPassword) {
        await resetPassword(email, otp, newPassword);
      }
      navigate('/login', { state: { message: 'Password reset successfully. Please login.' } });
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-400/30">
            <Package className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-center">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-blue-200/70 mt-2 text-center text-sm">
            {step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center relative z-10">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center relative z-10">
            {message}
          </div>
        )}

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOTP}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your registered email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEND OTP'}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="otp">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-center text-lg"
                    placeholder="------"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <p className={`text-xs flex items-center ${passwordReqs.length ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordReqs.length ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />} 8+ characters
                      </p>
                      <p className={`text-xs flex items-center ${passwordReqs.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordReqs.lowercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />} One lowercase
                      </p>
                      <p className={`text-xs flex items-center ${passwordReqs.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordReqs.uppercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />} One uppercase
                      </p>
                      <p className={`text-xs flex items-center ${passwordReqs.special ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordReqs.special ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />} One special char
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`text-xs mt-1.5 flex items-center ${doPasswordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                      {doPasswordsMatch ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                      {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || !doPasswordsMatch || otp.length !== 6}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'RESET PASSWORD'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center relative z-10">
          <Link to="/login" className="flex items-center text-sm text-blue-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
