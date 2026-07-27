import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ChevronLeft, ChevronRight, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentAPI.getAll({ search, status: statusFilter, page, limit: 10 });
      setAppointments(data.appointments);
      setTotalPages(data.pages);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, search, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    try { await appointmentAPI.delete(id); toast.success('Deleted!'); setDeleteConfirm(null); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Appointment Management</h2><p className="text-white/40 text-sm mt-1">Manage client appointments</p></div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10 !py-2.5" placeholder="Search appointments..." />
        </div>
        <div className="flex gap-2">
          {['all', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s ? 'btn-gold !px-4 !py-2.5' : 'glass-card text-white/60 hover:text-white'
              }`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>
      : appointments.length === 0 ? <div className="glass-card p-12 text-center"><Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" /><p className="text-white/40">No appointments found</p></div>
      : (
        <>
          <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs border-b border-white/5 bg-white/5">
              <th className="text-left py-3 px-4">Customer</th><th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Date & Time</th><th className="text-left py-3 px-4">Phone</th>
              <th className="text-left py-3 px-4">Status</th><th className="text-right py-3 px-4">Actions</th>
            </tr></thead>
            <tbody>{appointments.map((apt) => (
              <tr key={apt._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4"><p className="text-white font-medium">{apt.fullName}</p><p className="text-white/40 text-xs">{apt.email}</p></td>
                <td className="py-3 px-4"><p className="text-white/70">{apt.productName || 'N/A'}</p><p className="text-white/40 text-xs">{apt.productType}</p></td>
                <td className="py-3 px-4 text-white/60">{apt.preferredDate}<br/><span className="text-xs text-white/40">{apt.preferredTime}</span></td>
                <td className="py-3 px-4 text-white/60">{apt.phone}</td>
                <td className="py-3 px-4"><span className={apt.status === 'Approved' ? 'badge-approved' : apt.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>{apt.status}</span></td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {apt.status !== 'Approved' && <button onClick={() => updateStatus(apt._id, 'Approved')} title="Approve"
                      className="p-1.5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10"><CheckCircle className="w-4 h-4" /></button>}
                    {apt.status !== 'Rejected' && <button onClick={() => updateStatus(apt._id, 'Rejected')} title="Reject"
                      className="p-1.5 rounded-lg text-white/40 hover:text-orange-400 hover:bg-orange-400/10"><XCircle className="w-4 h-4" /></button>}
                    {apt.status !== 'Pending' && <button onClick={() => updateStatus(apt._id, 'Pending')} title="Set Pending"
                      className="p-1.5 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-400/10"><Clock className="w-4 h-4" /></button>}
                    <button onClick={() => setDeleteConfirm(apt._id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table></div></div>

          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-white/60 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass-card-strong p-6 max-w-sm w-full text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-bold text-white mb-2">Delete Appointment?</h3>
            <div className="flex gap-3 mt-6"><button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 flex-1">Delete</button></div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
