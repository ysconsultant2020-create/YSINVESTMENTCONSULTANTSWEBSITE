import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AppointmentForm from '../components/client/AppointmentForm';
import { insuranceAPI, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const categories = ['Health Insurance', 'Motor Insurance', 'Non-Motor Insurance', 'ICICI Insurance'];

const InsurancePage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailPlan, setDetailPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, [activeCategory]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await insuranceAPI.getAll(activeCategory);
      setPlans(data);
    } catch (err) {
      toast.error('Failed to load insurance plans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-24 pb-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">Insurance Plans</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Comprehensive protection for you and your family</p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              !activeCategory ? 'btn-gold' : 'glass-card text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat ? 'btn-gold' : 'glass-card text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/40">No insurance plans available yet</h3>
            <p className="text-white/30 mt-2">Check back soon for new plans</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group hover:border-gold-400/20 transition-all duration-300"
              >
                {plan.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={getImageUrl(plan.image)} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <span className="text-xs font-medium text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full">{plan.category}</span>
                  <h3 className="text-lg font-bold text-white mt-3 mb-2">{plan.title}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{plan.description}</p>
                  {plan.premium && <p className="text-gold-400 font-semibold text-sm mb-4">Premium: {plan.premium}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setDetailPlan(plan)}
                      className="flex-1 btn-outline !px-3 !py-2 text-xs">View Details</button>
                    <button onClick={() => setSelectedPlan(plan)}
                      className="flex-1 btn-gold !px-3 !py-2 text-xs flex items-center justify-center gap-1">
                      Book <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailPlan(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-card-strong p-8 max-h-[85vh] overflow-y-auto">
            {detailPlan.image && <img src={getImageUrl(detailPlan.image)} alt={detailPlan.title} className="w-full h-64 object-cover rounded-xl mb-6" />}
            <span className="text-xs font-medium text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full">{detailPlan.category}</span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-4">{detailPlan.title}</h2>
            <div className="space-y-4 text-white/70 text-sm">
              {detailPlan.description && <div><h4 className="text-gold-400 font-semibold mb-1">Description</h4><p>{detailPlan.description}</p></div>}
              {detailPlan.benefits && <div><h4 className="text-gold-400 font-semibold mb-1">Benefits</h4><p>{detailPlan.benefits}</p></div>}
              {detailPlan.premium && <div><h4 className="text-gold-400 font-semibold mb-1">Premium</h4><p>{detailPlan.premium}</p></div>}
              {detailPlan.coverage && <div><h4 className="text-gold-400 font-semibold mb-1">Coverage</h4><p>{detailPlan.coverage}</p></div>}
              {detailPlan.features && <div><h4 className="text-gold-400 font-semibold mb-1">Features</h4><p>{detailPlan.features}</p></div>}
              {detailPlan.eligibility && <div><h4 className="text-gold-400 font-semibold mb-1">Eligibility</h4><p>{detailPlan.eligibility}</p></div>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDetailPlan(null)} className="btn-outline flex-1">Close</button>
              <button onClick={() => { setDetailPlan(null); setSelectedPlan(detailPlan); }} className="btn-gold flex-1">Book Appointment</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Appointment Modal */}
      {selectedPlan && (
        <AppointmentForm product={selectedPlan} productType="Insurance" onClose={() => setSelectedPlan(null)} />
      )}

      <Footer />
    </div>
  );
};

export default InsurancePage;
