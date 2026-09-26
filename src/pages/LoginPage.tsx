import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginId || !password) {
      setError('Login Id and Password are required');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginId, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid Login Id or Password');
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
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-400/30">
            <Package className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StockSense</h1>
          <p className="text-blue-200/70 mt-2">Sign in to your account</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-4 bg-blue-500/15 border border-blue-400/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setLoginId('admin123');
                setPassword('Test@123');
                setError('');
              }}
              className="text-xs font-medium text-blue-300 hover:text-white bg-blue-600/40 hover:bg-blue-600/70 border border-blue-400/40 px-2.5 py-1 rounded-lg transition-all"
            >
              Auto-fill Demo
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
              <span className="text-blue-200/60 block text-[11px]">Login ID:</span>
              <span className="font-mono text-white font-medium select-all">admin123</span>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
              <span className="text-blue-200/60 block text-[11px]">Password:</span>
              <span className="font-mono text-white font-medium select-all">Test@123</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-blue-200/60">
            Forgot Password demo OTP: <span className="font-mono text-blue-300 font-semibold select-all">123456</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1.5" htmlFor="loginId">
              Login Id
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your login ID"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-blue-200/90" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-blue-200/70">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
