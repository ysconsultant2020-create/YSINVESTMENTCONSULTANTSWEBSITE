import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../ui/Logo';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: User, required: true },
    { name: 'email', type: 'email', placeholder: 'Email Address', icon: Mail, required: true },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number', icon: Phone, required: true },
    { name: 'city', type: 'text', placeholder: 'City (Optional)', icon: MapPin, required: false },
  ];

  return (
    <div className="min-h-screen w-full bg-navy-950 relative overflow-hidden flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 via-navy-900 to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vh] h-[40vh] rounded-b-full bg-gold-400/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative group">
          {/* Traveling light border */}
          <div className="absolute -inset-px rounded-2xl overflow-hidden">
            <motion.div className="absolute top-0 left-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ left: ['-40%', '100%'] }} transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }} />
            <motion.div className="absolute top-0 right-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent"
              animate={{ top: ['-40%', '100%'] }} transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.75 }} />
            <motion.div className="absolute bottom-0 right-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ right: ['-40%', '100%'] }} transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.5 }} />
            <motion.div className="absolute bottom-0 left-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent"
              animate={{ bottom: ['-40%', '100%'] }} transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 2.25 }} />
          </div>

          <div className="relative bg-navy-900/60 backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.06] shadow-2xl">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center mb-4">
                <Logo size="lg" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mt-2">Create Account</h1>
              <p className="text-white/50 text-sm mt-1">Join YS Investment Consultants</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.map((field) => (
                <div key={field.name} className="relative">
                  <field.icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                    focusedInput === field.name ? 'text-gold-400' : 'text-white/30'
                  }`} />
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => updateForm(field.name, e.target.value)}
                    onFocus={() => setFocusedInput(field.name)}
                    onBlur={() => setFocusedInput(null)}
                    className="input-field pl-11"
                    required={field.required}
                  />
                </div>
              ))}

              {/* Password */}
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  focusedInput === 'password' ? 'text-gold-400' : 'text-white/30'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="input-field pl-11 pr-11"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={isLoading} className="btn-gold w-full flex items-center justify-center gap-2 !py-3.5 !mt-6">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
                )}
              </motion.button>

              <p className="text-center text-white/50 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
