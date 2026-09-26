import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const SignupPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

  const validateLoginId = (id: string) => id.length >= 6 && id.length <= 12;
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  
  const passwordReqs = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  
  const isPasswordValid = Object.values(passwordReqs).every(Boolean);
  const doPasswordsMatch = password !== '' && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateLoginId(loginId) || !validateEmail(email) || !isPasswordValid || !doPasswordsMatch) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(loginId, email, password);
      navigate('/login', { state: { message: 'Account created successfully. Please login.' } });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-4 py-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl my-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-400/30">
            <Package className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StockSense</h1>
          <p className="text-blue-200/70 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="loginId">
              Login Id
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="6-12 characters"
            />
            {loginId && (
              <p className={`text-xs mt-1.5 flex items-center ${validateLoginId(loginId) ? 'text-green-400' : 'text-red-400'}`}>
                {validateLoginId(loginId) ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                Must be 6-12 characters
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="email">
              Email Id
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
            {email && (
              <p className={`text-xs mt-1.5 flex items-center ${validateEmail(email) ? 'text-green-400' : 'text-red-400'}`}>
                {validateEmail(email) ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                {validateEmail(email) ? 'Valid email' : 'Invalid email format'}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {password && (
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
                  {passwordReqs.special ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />} One special character
                </p>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="confirmPassword">
              Re-Enter Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
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
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading || !validateLoginId(loginId) || !validateEmail(email) || !isPasswordValid || !doPasswordsMatch}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN UP'}
          </motion.button>
        </motion.form>

        <p className="mt-8 text-center text-sm text-blue-200/70">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
