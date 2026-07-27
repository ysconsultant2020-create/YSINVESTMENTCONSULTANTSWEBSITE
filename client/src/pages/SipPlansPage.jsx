import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AppointmentForm from '../components/client/AppointmentForm';
import { sipPlanAPI, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const riskBadge = (risk) => {
  const map = { Low: 'badge-low', Moderate: 'badge-moderate', High: 'badge-high', 'Very High': 'badge-very-high' };
  return map[risk] || 'badge-moderate';
};

const SipPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailPlan, setDetailPlan] = useState(null);

  useEffect(() => {
    (async () => {
      try { const { data } = await sipPlanAPI.getAll(); setPlans(data); }
      catch { toast.error('Failed to load SIP plans'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gold-400/20 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">SIP Plans</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Build wealth with disciplined investing</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/40">No SIP plans available yet</h3>
            <p className="text-white/30 mt-2">Check back soon for new plans</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group hover:border-gold-400/20 transition-all duration-300">
                {plan.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={getImageUrl(plan.image)} alt={plan.planName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40">{plan.duration}</span>
                    <span className={riskBadge(plan.risk)}>{plan.risk}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{plan.planName}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{plan.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gold-400 font-semibold text-sm">Min: ₹{plan.minAmount}</span>
                    {plan.expectedReturns && <span className="text-green-400 text-xs">Returns: {plan.expectedReturns}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetailPlan(plan)} className="flex-1 btn-outline !px-3 !py-2 text-xs">Details</button>
                    <button onClick={() => setSelectedPlan(plan)} className="flex-1 btn-gold !px-3 !py-2 text-xs flex items-center justify-center gap-1">
                      Start SIP <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {detailPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailPlan(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl glass-card-strong p-8 max-h-[85vh] overflow-y-auto">
            {detailPlan.image && <img src={getImageUrl(detailPlan.image)} alt={detailPlan.planName} className="w-full h-64 object-cover rounded-xl mb-6" />}
            <h2 className="text-2xl font-bold text-white mb-4">{detailPlan.planName}</h2>
            <div className="space-y-3 text-white/70 text-sm">
              <p>{detailPlan.description}</p>
              <p><strong className="text-gold-400">Min Amount:</strong> ₹{detailPlan.minAmount}</p>
              <p><strong className="text-gold-400">Duration:</strong> {detailPlan.duration}</p>
              <p><strong className="text-gold-400">Risk:</strong> {detailPlan.risk}</p>
              {detailPlan.expectedReturns && <p><strong className="text-gold-400">Expected Returns:</strong> {detailPlan.expectedReturns}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDetailPlan(null)} className="btn-outline flex-1">Close</button>
              <button onClick={() => { setDetailPlan(null); setSelectedPlan(detailPlan); }} className="btn-gold flex-1">Book Appointment</button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedPlan && <AppointmentForm product={selectedPlan} productType="SIP" onClose={() => setSelectedPlan(null)} />}
      <Footer />
    </div>
  );
};

export default SipPlansPage;
