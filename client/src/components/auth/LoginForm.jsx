import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../ui/Logo';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const user = await login(email.trim(), password.trim());
      toast.success(`Welcome back${user.name ? ', ' + user.name : ''}!`);
      navigate(user.role === 'manager' ? '/manager' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-navy-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 via-navy-900 to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vh] h-[40vh] rounded-b-full bg-gold-400/10 blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vh] h-[40vh] rounded-t-full bg-gold-400/5 blur-[80px]" />
      
      {/* Animated spots */}
      <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-gold-400/5 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-gold-400/3 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative group">
          {/* Traveling light border */}
          <div className="absolute -inset-px rounded-2xl overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ left: ['-40%', '100%'] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent"
              animate={{ top: ['-40%', '100%'] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.75 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ right: ['-40%', '100%'] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.5 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent"
              animate={{ bottom: ['-40%', '100%'] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 2.25 }}
            />
          </div>

          {/* Card */}
          <div className="relative bg-navy-900/60 backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.06] shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="flex justify-center mb-4"
              >
                <Logo size="lg" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mt-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/50 text-sm mt-1"
              >
                Sign in to YS Investment Consultants
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  focusedInput === 'email' ? 'text-gold-400' : 'text-white/30'
                }`} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  className="input-field pl-11"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  focusedInput === 'password' ? 'text-gold-400' : 'text-white/30'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="input-field pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn-gold w-full flex items-center justify-center gap-2 !py-3.5"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin"
                    />
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Sign In <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Manager hint */}
              <div className="glass-card p-3 flex items-center gap-3">
                <Shield className="w-4 h-4 text-gold-400 shrink-0" />
                <p className="text-white/40 text-xs">
                  Manager? Use your admin credentials to access the dashboard.
                </p>
              </div>

              {/* Register link */}
              <p className="text-center text-white/50 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
