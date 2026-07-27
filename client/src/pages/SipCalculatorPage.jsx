import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

ChartJS.register(ArcElement, Tooltip, Legend);

const SipCalculatorPage = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const totalInvested = monthly * n;
    const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const returns = futureValue - totalInvested;
    return { totalInvested: Math.round(totalInvested), returns: Math.round(returns), futureValue: Math.round(futureValue) };
  }, [monthly, rate, years]);

  const chartData = {
    labels: ['Total Invested', 'Estimated Returns'],
    datasets: [{
      data: [result.totalInvested, result.returns],
      backgroundColor: ['rgba(26, 41, 66, 0.8)', 'rgba(212, 175, 55, 0.8)'],
      borderColor: ['rgba(26, 41, 66, 1)', 'rgba(212, 175, 55, 1)'],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.6)', padding: 20, font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ₹${ctx.parsed.toLocaleString('en-IN')}`
        }
      }
    }
  };

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gold-400/20 flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">SIP Calculator</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Plan your investments and estimate future returns</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Investment Details</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white/60 text-sm">Monthly Investment</label>
                  <span className="text-gold-400 font-semibold">{fmt(monthly)}</span>
                </div>
                <input type="range" min="500" max="100000" step="500" value={monthly} onChange={(e) => setMonthly(+e.target.value)}
                  className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-gold-400" />
                <div className="flex justify-between mt-1 text-xs text-white/30"><span>₹500</span><span>₹1,00,000</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white/60 text-sm">Expected Annual Return</label>
                  <span className="text-gold-400 font-semibold">{rate}%</span>
                </div>
                <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(+e.target.value)}
                  className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-gold-400" />
                <div className="flex justify-between mt-1 text-xs text-white/30"><span>1%</span><span>30%</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white/60 text-sm">Investment Period</label>
                  <span className="text-gold-400 font-semibold">{years} Years</span>
                </div>
                <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(+e.target.value)}
                  className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-gold-400" />
                <div className="flex justify-between mt-1 text-xs text-white/30"><span>1 Yr</span><span>40 Yrs</span></div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Results</h3>
            <div className="h-64 mb-8">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-white/60">Total Invested</span>
                <span className="text-white font-bold text-lg">{fmt(result.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-white/60">Estimated Returns</span>
                <span className="text-green-400 font-bold text-lg">{fmt(result.returns)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/60">Total Value</span>
                <span className="text-gradient-gold font-bold text-2xl">{fmt(result.futureValue)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SipCalculatorPage;
