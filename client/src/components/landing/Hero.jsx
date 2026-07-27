import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Wallet, Leaf, Calculator, Sparkles } from 'lucide-react';
import Logo from '../ui/Logo';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background with luxury gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Dynamic Animated Particles & Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-navy-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-gold-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }} />
      
      {/* Geometric Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
        backgroundSize: '70px 70px'
      }} />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/30 backdrop-blur-xl mb-8 shadow-lg shadow-gold-400/5"
        >
          <Sparkles className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs sm:text-sm font-semibold text-gold-300 tracking-wider uppercase">
            Premier Financial Advisory & Wealth Management
          </span>
        </motion.div>


        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display mb-6 leading-[1.15] tracking-tight"
        >
          <span className="text-white drop-shadow-lg">Your Wealth,</span>
          <br />
          <span className="text-gradient-gold drop-shadow-2xl">Our Expertise</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/70 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light"
        >
          Expert financial advisory for <strong className="text-gold-300 font-semibold">Mutual Funds</strong>, <strong className="text-gold-300 font-semibold">SIP</strong>, <strong className="text-gold-300 font-semibold">Insurance</strong> & <strong className="text-gold-300 font-semibold">Wealth Planning</strong>. Build a secure, prosperous future with tailored investment strategies.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register" className="btn-gold flex items-center gap-3 text-base sm:text-lg !px-8 !py-4 group">
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="btn-outline flex items-center gap-3 text-base sm:text-lg !px-8 !py-4">
            Book Consultation
          </Link>
        </motion.div>

        {/* Service Feature Grid with Micro-Animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: TrendingUp, label: 'Mutual Funds', link: '/mutual-funds', color: 'from-green-500/20 to-emerald-500/20' },
            { icon: Shield, label: 'Insurance', link: '/insurance', color: 'from-blue-500/20 to-cyan-500/20' },
            { icon: Wallet, label: 'SIP Plans', link: '/sip-plans', color: 'from-gold-400/20 to-yellow-500/20' },
            { icon: Calculator, label: 'SIP & Lumpsum', link: '/sip-calculator', color: 'from-purple-500/20 to-pink-500/20' },
          ].map((item, i) => (
            <motion.div key={item.label} whileHover={{ y: -6, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link
                to={item.link}
                className="glass-card p-5 flex flex-col items-center gap-3 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-400/10 transition-all duration-300 block"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 flex items-center justify-center shadow-inner`}>
                  <item.icon className="w-6 h-6 text-gold-300" />
                </div>
                <span className="text-white/90 text-sm font-semibold tracking-wide">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gold-400/30 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gold-400"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
