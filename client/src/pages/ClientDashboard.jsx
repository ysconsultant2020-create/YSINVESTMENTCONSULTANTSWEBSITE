import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Wallet, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { appointmentAPI } from '../services/api';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await appointmentAPI.getMy();
        setAppointments(data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const statusIcon = (s) => {
    if (s === 'Approved') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (s === 'Rejected') return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name || 'Client'}</h1>
            <p className="text-white/50 mb-8">Explore our financial products and manage your appointments</p>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { name: 'Insurance', icon: Shield, href: '/insurance', color: 'from-blue-500/20 to-cyan-500/20' },
                { name: 'Mutual Funds', icon: TrendingUp, href: '/mutual-funds', color: 'from-green-500/20 to-emerald-500/20' },
                { name: 'SIP Plans', icon: Wallet, href: '/sip-plans', color: 'from-gold-400/20 to-yellow-500/20' },
                { name: 'SIP Calculator', icon: Calendar, href: '/sip-calculator', color: 'from-purple-500/20 to-pink-500/20' },
              ].map((item) => (
                <Link key={item.name} to={item.href}>
                  <motion.div whileHover={{ y: -4 }} className="glass-card p-6 flex items-center gap-4 group hover:border-gold-400/20 transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Appointments */}
            <h2 className="text-xl font-bold text-white mb-4">My Appointments</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white/40">No appointments yet</h3>
                <p className="text-white/30 mt-2">Browse our products and book your first appointment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <motion.div key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {statusIcon(apt.status)}
                      <div>
                        <p className="text-white font-medium text-sm">{apt.productName || apt.productType}</p>
                        <p className="text-white/40 text-xs">{apt.productType} • {apt.preferredDate} at {apt.preferredTime}</p>
                      </div>
                    </div>
                    <span className={apt.status === 'Approved' ? 'badge-approved' : apt.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>
                      {apt.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
