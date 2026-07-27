import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Calculator, PieChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AppointmentForm from '../components/client/AppointmentForm';
import { mutualFundAPI, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const riskBadge = (risk) => {
  const map = { Low: 'badge-low', Moderate: 'badge-moderate', High: 'badge-high', 'Very High': 'badge-very-high' };
  return map[risk] || 'badge-moderate';
};

const MutualFundsPage = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState(null);
  const [detailFund, setDetailFund] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await mutualFundAPI.getAll();
        setFunds(data);
      } catch { toast.error('Failed to load mutual funds'); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = ['All', ...new Set(funds.map(f => f.category).filter(Boolean))];

  const filteredFunds = categoryFilter === 'All' 
    ? funds 
    : funds.filter(f => f.category === categoryFilter);

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">Mutual Funds</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Expertly curated equity, debt & hybrid mutual funds designed for wealth appreciation and optimal tax efficiency.
            </p>
          </motion.div>

          {/* Quick Calculators Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/sip-calculator" className="glass-card px-5 py-3 flex items-center gap-3 hover:border-gold-400/40 transition-all group">
              <Calculator className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-xs text-white/50 block">Investment Tool</span>
                <span className="text-sm font-semibold text-white group-hover:text-gold-300">SIP Calculator</span>
              </div>
            </Link>

            <Link to="/lumpsum-calculator" className="glass-card px-5 py-3 flex items-center gap-3 hover:border-gold-400/40 transition-all group">
              <PieChart className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-xs text-white/50 block">Investment Tool</span>
                <span className="text-sm font-semibold text-white group-hover:text-gold-300">Lumpsum Calculator</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'btn-gold !py-2 !px-4'
                    : 'glass-card text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredFunds.length === 0 ? (
          <div className="text-center py-20">
            <TrendingUp className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/40">No mutual funds available yet</h3>
            <p className="text-white/30 mt-2">Check back soon for new funds</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunds.map((fund, i) => (
              <motion.div key={fund._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group hover:border-gold-400/20 transition-all duration-300">
                {fund.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={getImageUrl(fund.image)} alt={fund.fundName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-xs">{fund.amc}</span>
                    <span className={riskBadge(fund.riskLevel)}>{fund.riskLevel}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{fund.fundName}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{fund.description}</p>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    {fund.returns && <span className="text-green-400 font-semibold">{fund.returns} p.a.</span>}
                    {fund.minInvestment && <span className="text-gold-400 font-medium">Min: ₹{fund.minInvestment}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetailFund(fund)} className="flex-1 btn-outline !px-3 !py-2 text-xs">Details</button>
                    <button onClick={() => setSelectedFund(fund)} className="flex-1 btn-gold !px-3 !py-2 text-xs flex items-center justify-center gap-1">
                      Invest <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {detailFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailFund(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl glass-card-strong p-8 max-h-[85vh] overflow-y-auto">
            {detailFund.image && <img src={getImageUrl(detailFund.image)} alt={detailFund.fundName} className="w-full h-64 object-cover rounded-xl mb-6" />}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/50 text-sm">{detailFund.amc}</span>
              <span className={riskBadge(detailFund.riskLevel)}>{detailFund.riskLevel}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{detailFund.fundName}</h2>
            <div className="space-y-3 text-white/70 text-sm">
              <p>{detailFund.description}</p>
              {detailFund.category && <p><strong className="text-gold-400">Category:</strong> {detailFund.category}</p>}
              {detailFund.returns && <p><strong className="text-gold-400">Returns:</strong> {detailFund.returns}</p>}
              {detailFund.minInvestment && <p><strong className="text-gold-400">Min Investment:</strong> ₹{detailFund.minInvestment}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDetailFund(null)} className="btn-outline flex-1">Close</button>
              <button onClick={() => { setDetailFund(null); setSelectedFund(detailFund); }} className="btn-gold flex-1">Book Appointment</button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedFund && <AppointmentForm product={selectedFund} productType="Mutual Fund" onClose={() => setSelectedFund(null)} />}
      <Footer />
    </div>
  );
};

export default MutualFundsPage;
