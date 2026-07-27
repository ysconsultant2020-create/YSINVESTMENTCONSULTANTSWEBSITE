import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search, Shield } from 'lucide-react';
import { insuranceAPI } from '../../services/api';
import toast from 'react-hot-toast';

const categories = ['Health Insurance', 'Motor Insurance', 'Non-Motor Insurance', 'ICICI Insurance'];

const emptyForm = {
  title: '', category: 'Health Insurance', description: '', benefits: '',
  premium: '', coverage: '', features: '', eligibility: '', isActive: true
};

const InsuranceManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await insuranceAPI.getAll(); setItems(data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ ...item }); setImageFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== 'image' && k !== '_id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt') fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await insuranceAPI.update(editing, fd); toast.success('Updated!'); }
      else { await insuranceAPI.create(fd); toast.success('Created!'); }
      setShowForm(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await insuranceAPI.delete(id); toast.success('Deleted!'); setDeleteConfirm(null); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Insurance Management</h2>
          <p className="text-white/40 text-sm mt-1">{items.length} plans total</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 !py-2.5">
          <Plus className="w-4 h-4" /> Add Insurance
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 !py-2.5" placeholder="Search insurance plans..." />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Shield className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No insurance plans found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs border-b border-white/5 bg-white/5">
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Premium</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/60">{item.category}</td>
                    <td className="py-3 px-4 text-gold-400">{item.premium || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={item.isActive ? 'badge-approved' : 'badge-rejected'}>{item.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(item._id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
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
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-sm w-full text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Delete Insurance Plan?</h3>
            <p className="text-white/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex-1">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Insurance Plan</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field !py-2.5 text-sm" required />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                    className="input-field !py-2.5 text-sm">
                    {categories.map(c => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  className="input-field min-h-[80px] resize-none text-sm" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Premium</label>
                  <input value={form.premium} onChange={(e) => setForm({...form, premium: e.target.value})} className="input-field !py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Coverage</label>
                  <input value={form.coverage} onChange={(e) => setForm({...form, coverage: e.target.value})} className="input-field !py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Benefits</label>
                <textarea value={form.benefits} onChange={(e) => setForm({...form, benefits: e.target.value})} className="input-field min-h-[60px] resize-none text-sm" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Features</label>
                <textarea value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} className="input-field min-h-[60px] resize-none text-sm" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Eligibility</label>
                <textarea value={form.eligibility} onChange={(e) => setForm({...form, eligibility: e.target.value})} className="input-field min-h-[60px] resize-none text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                    className="input-field !py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gold-400/10 file:text-gold-400 file:font-medium file:text-xs" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold-400" />
                    <span className="text-white/60 text-sm">Active (visible to clients)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;
