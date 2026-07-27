import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Calendar, Clock, MapPin, User, Mail, Phone } from 'lucide-react';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AppointmentForm = ({ product, productType, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', preferredDate: '', preferredTime: '', city: '', message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.preferredDate || !form.preferredTime) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await appointmentAPI.create({
        ...form,
        productType,
        productId: product?._id || '000000000000000000000000',
        productName: product?.title || product?.fundName || product?.planName || product?.name || productType || 'Wealth Planning Consultation',
      });
      setSuccess(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg glass-card-strong p-6 max-h-[90vh] overflow-y-auto"
        >
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h3>
              <p className="text-white/60 mb-6">We'll contact you shortly to confirm your appointment.</p>
              <button onClick={onClose} className="btn-gold">Close</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Book Appointment</h3>
                  <p className="text-white/50 text-sm mt-1">
                    {productType}{product ? `: ${product.title || product.fundName || product.planName || product.name || ''}` : ''}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" placeholder="Your full name" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" placeholder="your@email.com" required />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" placeholder="Phone number" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" placeholder="Your city" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Preferred Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="date" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" required min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Preferred Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="time" value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)}
                        className="input-field pl-10 !py-2.5 text-sm" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Message</label>
                  <textarea value={form.message} onChange={(e) => update('message', e.target.value)}
                    className="input-field min-h-[80px] resize-none text-sm" placeholder="Any specific requirements..." />
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Book Appointment</>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppointmentForm;
