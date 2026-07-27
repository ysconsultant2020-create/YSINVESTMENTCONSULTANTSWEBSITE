import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Instagram, Phone, Mail } from 'lucide-react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.create(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      
      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Contact Us</span>
          <h2 className="section-heading mt-3">
            <span className="text-white">Get In </span>
            <span className="text-gradient-gold">Touch</span>
          </h2>
          <p className="section-subheading">
            Have questions? Reach out to us and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <a href="https://www.instagram.com/ysinvestmentconsultants/" target="_blank" rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 group hover:border-gold-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                <Instagram className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Instagram</p>
                <p className="text-white/50 text-sm">@ysinvestmentconsultant</p>
              </div>
            </a>

            <a href="tel:9810062733" className="glass-card p-5 flex items-center gap-4 group hover:border-gold-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                <Phone className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Phone</p>
                <p className="text-white/50 text-sm">9810062733</p>
              </div>
            </a>

            <a href="mailto:ysconsultant2020@gmail.com" className="glass-card p-5 flex items-center gap-4 group hover:border-gold-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                <Mail className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Email</p>
                <p className="text-white/50 text-sm">ysconsultant2020@gmail.com</p>
              </div>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="input-field" placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    className="input-field" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="input-field" placeholder="Your phone" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="input-field" placeholder="Subject" />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                  className="input-field min-h-[120px] resize-none" placeholder="Your message..." required />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Google Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 glass-card p-4 overflow-hidden rounded-2xl border border-white/10"
        >
          <div className="w-full h-64 rounded-xl overflow-hidden relative bg-navy-900 flex items-center justify-center">
            <iframe
              title="Google Map Placeholder"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448183.7391741527!2d76.81307299667798!3d28.643684624474773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) opacity(0.8)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
