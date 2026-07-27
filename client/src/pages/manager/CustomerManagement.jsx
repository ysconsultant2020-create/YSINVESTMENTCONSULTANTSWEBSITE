import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, X, Check } from 'lucide-react';
import { customerAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Edit Modal
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', city: '' });
  const [editSaving, setEditSaving] = useState(false);

  // Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await customerAPI.getAll({ search, page, limit: 10 });
      setCustomers(data.customers);
      setTotalPages(data.pages);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const viewDetail = async (id) => {
    setDetailLoading(true);
    try {
      const { data } = await customerAPI.getById(id);
      setDetail(data);
    } catch { toast.error('Failed to load details'); }
    finally { setDetailLoading(false); }
  };

  const openEdit = (customer) => {
    setEditingCustomer(customer._id);
    setEditForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      city: customer.city || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email || !editForm.phone) {
      toast.error('Name, email, and phone are required');
      return;
    }
    setEditSaving(true);
    try {
      await customerAPI.update(editingCustomer, editForm);
      toast.success('Customer updated successfully!');
      setEditingCustomer(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await customerAPI.delete(deleteConfirmId);
      toast.success('Customer deleted successfully!');
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Management</h2>
          <p className="text-white/40 text-sm mt-1">View, edit, and manage registered clients & contacts</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-10 !py-2.5"
          placeholder="Search by name, email, phone, city..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No customers found</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/5 bg-white/5">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">City</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Joined / Contacted</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{c.name}</td>
                      <td className="py-3 px-4 text-white/60">{c.email}</td>
                      <td className="py-3 px-4 text-white/60">{c.phone}</td>
                      <td className="py-3 px-4 text-white/60">{c.city || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={c.isRegistered ? 'badge-approved' : 'badge-pending'}>
                          {c.isRegistered ? 'Registered' : 'Lead Contact'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/40 text-xs">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => viewDetail(c._id)}
                            title="View Appointments"
                            className="p-2 rounded-lg text-white/40 hover:text-gold-400 hover:bg-gold-400/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            title="Edit Customer"
                            className="p-2 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(c._id)}
                            title="Delete Customer"
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/60 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setEditingCustomer(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Customer</h3>
              <button onClick={() => setEditingCustomer(null)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field !py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="input-field !py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Phone *</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-field !py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="input-field !py-2.5 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingCustomer(null)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  {editSaving ? (
                    <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-sm w-full text-center"
          >
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Delete Customer?</h3>
            <p className="text-white/50 text-sm mb-6">
              This will remove the customer record and associated appointments. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="btn-outline flex-1">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex-1"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Details Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDetail(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Customer Details</h3>
              <button onClick={() => setDetail(null)} className="p-1 text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-3 text-sm mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  <p><span className="text-white/40">Name:</span> <span className="text-white font-medium ml-2">{detail.customer.name}</span></p>
                  <p><span className="text-white/40">Email:</span> <span className="text-white font-medium ml-2">{detail.customer.email}</span></p>
                  <p><span className="text-white/40">Phone:</span> <span className="text-white font-medium ml-2">{detail.customer.phone}</span></p>
                  <p><span className="text-white/40">City:</span> <span className="text-white font-medium ml-2">{detail.customer.city || 'N/A'}</span></p>
                </div>
                <h4 className="text-white font-semibold mb-3">Appointments ({detail.appointments.length})</h4>
                {detail.appointments.length === 0 ? (
                  <p className="text-white/40 text-sm">No appointments found for this customer.</p>
                ) : (
                  <div className="space-y-2">
                    {detail.appointments.map((apt) => (
                      <div key={apt._id} className="glass-card p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{apt.productName || apt.productType}</p>
                          <p className="text-white/40 text-xs">{apt.preferredDate} • {apt.preferredTime}</p>
                        </div>
                        <span className={apt.status === 'Approved' ? 'badge-approved' : apt.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <button onClick={() => setDetail(null)} className="btn-outline w-full mt-6">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
