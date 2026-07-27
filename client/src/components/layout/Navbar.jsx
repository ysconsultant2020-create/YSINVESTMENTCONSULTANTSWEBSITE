import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, LogOut, LayoutDashboard, Calculator,
  TrendingUp, Shield, Wallet, PieChart, Sparkles, ArrowRight
} from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);

  const { user, isAuthenticated, isManager, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setServicesDropdownOpen(false);
    setCalcDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const services = [
    { name: 'Insurance', href: '/insurance', desc: 'Health, Motor & Commercial Protection', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Mutual Funds', href: '/mutual-funds', desc: 'Equity, Debt & Hybrid Portfolios', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { name: 'SIP Plans', href: '/sip-plans', desc: 'Disciplined Monthly Wealth Growth', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
    { name: 'Lumpsum Plans', href: '/lumpsum-plans', desc: 'One-Time Capital Growth Solutions', icon: PieChart, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const calculators = [
    { name: 'SIP Calculator', href: '/sip-calculator', desc: 'Calculate compounding monthly returns' },
    { name: 'Lumpsum Calculator', href: '/lumpsum-calculator', desc: 'Estimate one-time investment growth' },
  ];

  const isActive = (href) => location.pathname === href;
  const isServicesActive = ['/insurance', '/mutual-funds', '/sip-plans', '/lumpsum-plans'].includes(location.pathname);
  const isCalcActive = location.pathname.includes('calculator');

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-950/95 backdrop-blur-2xl shadow-2xl border-b border-gold-400/15 py-3'
            : 'bg-gradient-to-b from-navy-950/95 via-navy-950/70 to-transparent backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <Logo size="md" />
            </Link>

            {/* Central Desktop Nav Items - Compact Single Line */}
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 px-2 py-1.5 rounded-2xl backdrop-blur-2xl shadow-inner">
              
              {/* Home */}
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/')
                    ? 'text-gold-400 bg-gold-400/10 shadow-sm border border-gold-400/20'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative" onMouseLeave={() => setServicesDropdownOpen(false)}>
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isServicesActive
                      ? 'text-gold-400 bg-gold-400/10 border border-gold-400/20'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-gold-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="absolute top-full left-0 mt-3 w-80 bg-[#0c182c] border border-gold-400/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3.5 z-[100]"
                    >
                      <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider px-3 py-1 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Investment & Advisory
                      </div>
                      <div className="space-y-1">
                        {services.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-all group"
                          >
                            <div className={`p-2 rounded-lg ${item.bg} shrink-0 mt-0.5`}>
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors block">
                                {item.name}
                              </span>
                              <span className="text-xs text-white/50 block leading-tight">{item.desc}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Calculators Dropdown */}
              <div className="relative" onMouseLeave={() => setCalcDropdownOpen(false)}>
                <button
                  onClick={() => setCalcDropdownOpen(!calcDropdownOpen)}
                  onMouseEnter={() => setCalcDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isCalcActive
                      ? 'text-gold-400 bg-gold-400/10 border border-gold-400/20'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-gold-400" />
                  Calculators
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${calcDropdownOpen ? 'rotate-180 text-gold-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {calcDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="absolute top-full left-0 mt-3 w-72 bg-[#0c182c] border border-gold-400/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3.5 z-[100]"
                    >
                      <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider px-3 py-1 mb-1">
                        Financial Calculators
                      </div>
                      <div className="space-y-1">
                        {calculators.map((calc) => (
                          <Link
                            key={calc.href}
                            to={calc.href}
                            className="flex flex-col p-2.5 rounded-xl hover:bg-white/10 transition-all group"
                          >
                            <span className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
                              {calc.name}
                            </span>
                            <span className="text-xs text-white/50">{calc.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/contact')
                    ? 'text-gold-400 bg-gold-400/10 border border-gold-400/20'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Contact
              </Link>

            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={isManager ? '/manager' : '/dashboard'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/30 hover:bg-gold-400/20 shadow-lg transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-outline !px-5 !py-2.5 text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-gold !px-5 !py-2.5 text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-white/80 hover:text-white bg-white/5 border border-white/10 transition-all"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-navy-900/98 backdrop-blur-2xl border-l border-gold-400/20 shadow-2xl p-6 pt-24 overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                <Link to="/" className={`px-4 py-3 rounded-xl text-base font-semibold ${isActive('/') ? 'text-gold-400 bg-gold-400/10' : 'text-white/80'}`}>
                  Home
                </Link>

                {/* Mobile Services */}
                <div className="p-3 glass-card space-y-2">
                  <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider px-2">Services</div>
                  {services.map((s) => (
                    <Link key={s.href} to={s.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      {s.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Calculators */}
                <div className="p-3 glass-card space-y-2">
                  <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider px-2">Calculators</div>
                  {calculators.map((c) => (
                    <Link key={c.href} to={c.href} className="block px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10">
                      {c.name}
                    </Link>
                  ))}
                </div>

                <Link to="/contact" className={`px-4 py-3 rounded-xl text-base font-semibold ${isActive('/contact') ? 'text-gold-400 bg-gold-400/10' : 'text-white/80'}`}>
                  Contact
                </Link>

                <div className="border-t border-white/10 mt-4 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={isManager ? '/manager' : '/dashboard'}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-gold-400 bg-gold-400/10 mb-2"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-3 rounded-xl text-center btn-outline mb-2">
                        Sign In
                      </Link>
                      <Link to="/register" className="block px-4 py-3 rounded-xl text-center btn-gold">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
