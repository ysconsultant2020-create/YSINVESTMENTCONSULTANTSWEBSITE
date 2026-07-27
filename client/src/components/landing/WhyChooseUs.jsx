import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Headphones, TrendingUp, Lock, UserCheck, BarChart3 } from 'lucide-react';

const reasons = [
  {
    icon: UserCheck,
    title: 'Expert Advisors',
    description: 'Our certified financial advisors bring years of experience in investment management.'
  },
  {
    icon: TrendingUp,
    title: 'Proven Track Record',
    description: 'Consistently delivering superior returns through research-backed investment strategies.'
  },
  {
    icon: Lock,
    title: 'Secure & Transparent',
    description: 'Complete transparency in all transactions with robust security measures for your investments.'
  },
  {
    icon: BarChart3,
    title: 'Personalized Plans',
    description: 'Customized investment plans aligned with your risk appetite and financial goals.'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to address your queries and concerns promptly.'
  },
  {
    icon: CheckCircle2,
    title: 'Hassle-Free Process',
    description: 'Simplified paperwork and digital processes for quick and easy investment management.'
  },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="why-us" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[150px]" />

      <div ref={ref} className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="section-heading mt-3">
            <span className="text-white">Built on </span>
            <span className="text-gradient-gold">Trust & Excellence</span>
          </h2>
          <p className="section-subheading">
            Discover why hundreds of clients trust YS Investment Consultants for their financial journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group hover:border-gold-400/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4 group-hover:bg-gold-400/20 transition-all">
                <reason.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
