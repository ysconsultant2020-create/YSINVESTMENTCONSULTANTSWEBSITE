import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, Wallet, PieChart, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { customerAPI, appointmentAPI } from '../../services/api';

const ManagerHome = () => {
  const [stats, setStats] = useState({ customers: 0, insurance: 0, mutualFunds: 0, sipPlans: 0, lumpsumPlans: 0, appointments: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, aptsRes] = await Promise.all([
          customerAPI.getStats(),
          appointmentAPI.getAll({ limit: 5 })
        ]);
        setStats(statsRes.data);
        setRecentAppointments(aptsRes.data.appointments);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: 'Total Customers', value: stats.customers, icon: Users, color: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400' },
    { label: 'Insurance Plans', value: stats.insurance, icon: Shield, color: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400' },
    { label: 'Mutual Funds', value: stats.mutualFunds, icon: TrendingUp, color: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400' },
    { label: 'SIP Plans', value: stats.sipPlans, icon: Wallet, color: 'from-gold-400/20 to-yellow-500/20', text: 'text-gold-400' },
    { label: 'Lumpsum Plans', value: stats.lumpsumPlans, icon: PieChart, color: 'from-amber-500/20 to-yellow-600/20', text: 'text-amber-400' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'from-orange-500/20 to-red-500/20', text: 'text-orange-400' },
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-white/40 text-xs mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Appointments</h3>
        {recentAppointments.length === 0 ? (
          <p className="text-white/40 text-sm py-8 text-center">No appointments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs border-b border-white/5">
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <p className="text-white font-medium">{apt.fullName}</p>
                      <p className="text-white/40 text-xs">{apt.email}</p>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-white/70">{apt.productName || 'N/A'}</p>
                      <p className="text-white/40 text-xs">{apt.productType}</p>
                    </td>
                    <td className="py-3 px-2 text-white/60">{apt.preferredDate}</td>
                    <td className="py-3 px-2">
                      <span className={apt.status === 'Approved' ? 'badge-approved' : apt.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerHome;
