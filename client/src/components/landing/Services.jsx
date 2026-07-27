import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Wallet, Leaf, ArrowRight, Calendar } from 'lucide-react';
import AppointmentForm from '../client/AppointmentForm';

const services = [
  {
    icon: Shield,
    title: 'Insurance',
    description: 'Comprehensive health, motor, and non-motor insurance plans to protect what matters most to you and your family.',
    link: '/insurance',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'hover:border-blue-400/30'
  },
  {
    icon: TrendingUp,
    title: 'Mutual Funds',
    description: 'Expertly curated mutual fund portfolios across equity, debt, and hybrid categories for optimized returns.',
    link: '/mutual-funds',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'hover:border-green-400/30'
  },
  {
    icon: Wallet,
    title: 'SIP',
    description: 'Systematic Investment Plans to build wealth gradually with disciplined investing and the power of compounding.',
    link: '/sip-plans',
    color: 'from-gold-400/20 to-yellow-500/20',
    borderColor: 'hover:border-gold-400/30'
  },
  {
    icon: Leaf,
    title: 'Wealth Planning',
    description: 'Holistic wealth management strategies including tax planning, retirement planning, and estate planning.',
    isModal: true,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'hover:border-purple-400/30'
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showWealthModal, setShowWealthModal] = useState(false);

  return (
    <section id="services" className="relative py-24">
      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Our Services</span>
          <h2 className="section-heading mt-3">
            <span className="text-white">Comprehensive Financial </span>
            <span className="text-gradient-gold">Solutions</span>
          </h2>
          <p className="section-subheading">
            From insurance protection to wealth creation, we offer end-to-end financial services tailored to your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              {service.isModal ? (
                <div
                  onClick={() => setShowWealthModal(true)}
                  className={`glass-card p-8 group cursor-pointer ${service.borderColor} transition-all duration-500 hover:-translate-y-1 h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient-gold transition-all">
                      {service.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                    <Calendar className="w-4 h-4" /> Book Wealth Consultation <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              ) : (
                <Link to={service.link}>
                  <div className={`glass-card p-8 group cursor-pointer ${service.borderColor} transition-all duration-500 hover:-translate-y-1 h-full flex flex-col justify-between`}>
                    <div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient-gold transition-all">
                        {service.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wealth Planning Appointment Modal */}
      {showWealthModal && (
        <AppointmentForm
          product={{ name: 'Wealth Creation & Retirement Strategy' }}
          productType="Wealth Planning"
          onClose={() => setShowWealthModal(false)}
        />
      )}
    </section>
  );
};

export default Services;
