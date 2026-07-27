import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Award, Users, Clock } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: Target, value: '₹10Cr+', label: 'Assets Managed' },
    { icon: Clock, value: '24/7', label: 'Support' },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">About Us</span>
          <h2 className="section-heading mt-3">
            <span className="text-white">Trusted Financial </span>
            <span className="text-gradient-gold">Advisory</span>
          </h2>
          <p className="section-subheading">
            YS Investment Consultants is dedicated to helping individuals and families achieve their financial goals through expert guidance and personalized strategies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-white/70 leading-relaxed text-lg">
              At YS Investment Consultants, we believe that every individual deserves access to quality financial planning. Our team of experienced advisors works closely with you to understand your unique financial situation and goals.
            </p>
            <p className="text-white/60 leading-relaxed">
              Whether you're looking to invest in Mutual Funds, start a SIP, secure your family with Insurance, or plan your wealth for the long term, we provide comprehensive solutions tailored to your needs.
            </p>
            <p className="text-white/60 leading-relaxed">
              With a client-first approach, transparent processes, and continuous support, we ensure your journey towards financial freedom is smooth and rewarding.
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 text-center group hover:border-gold-400/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-400/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-400/20 transition-all">
                  <stat.icon className="w-6 h-6 text-gold-400" />
                </div>
                <div className="text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
