import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search, TrendingUp } from 'lucide-react';
import { mutualFundAPI, getImageUrl } from '../../services/api';
import toast from 'react-hot-toast';

const risks = ['Low', 'Moderate', 'High', 'Very High'];
const categories = ['Equity', 'Debt', 'Hybrid', 'ELSS (Tax Saving)', 'Liquid'];
const emptyForm = { fundName: '', amc: '', riskLevel: 'Moderate', category: '', returns: '', description: '', minInvestment: '', isActive: true };

const MutualFundManagement = () => {
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
    try { const { data } = await mutualFundAPI.getAll(); setItems(data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ ...item }); setImageFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (!['image', '_id', '__v', 'createdAt', 'updatedAt'].includes(k)) fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await mutualFundAPI.update(editing, fd); toast.success('Updated!'); }
      else { await mutualFundAPI.create(fd); toast.success('Created!'); }
      setShowForm(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await mutualFundAPI.delete(id); toast.success('Deleted!'); setDeleteConfirm(null); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const filtered = items.filter(i => i.fundName.toLowerCase().includes(search.toLowerCase()) || i.amc.toLowerCase().includes(search.toLowerCase()));
  const rb = (r) => ({ Low: 'badge-low', Moderate: 'badge-moderate', High: 'badge-high', 'Very High': 'badge-very-high' }[r] || 'badge-moderate');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-white">Mutual Fund Management</h2><p className="text-white/40 text-sm mt-1">{items.length} funds total</p></div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 !py-2.5"><Plus className="w-4 h-4" /> Add Fund</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 !py-2.5" placeholder="Search funds..." />
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>
      : filtered.length === 0 ? <div className="glass-card p-12 text-center"><TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-4" /><p className="text-white/40">No mutual funds found</p></div>
      : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/40 text-xs border-b border-white/5 bg-white/5">
                <th className="text-left py-3 px-4">Fund</th><th className="text-left py-3 px-4">AMC</th>
                <th className="text-left py-3 px-4">Risk</th><th className="text-left py-3 px-4">Returns</th>
                <th className="text-left py-3 px-4">Status</th><th className="text-right py-3 px-4">Actions</th>
              </tr></thead>
              <tbody>{filtered.map((item) => (
                <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4"><div className="flex items-center gap-3">{item.image && <img src={getImageUrl(item.image)} alt="" className="w-10 h-10 rounded-lg object-cover" />}<div><p className="text-white font-medium">{item.fundName}</p><p className="text-white/40 text-xs">{item.category}</p></div></div></td>
                  <td className="py-3 px-4 text-white/60">{item.amc}</td>
                  <td className="py-3 px-4"><span className={rb(item.riskLevel)}>{item.riskLevel}</span></td>
                  <td className="py-3 px-4 text-green-400">{item.returns || 'N/A'}</td>
                  <td className="py-3 px-4"><span className={item.isActive ? 'badge-approved' : 'badge-rejected'}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(item._id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass-card-strong p-6 max-w-sm w-full text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Delete Mutual Fund?</h3>
            <p className="text-white/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 flex-1">Delete</button></div>
          </motion.div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Mutual Fund</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs mb-1.5 block">Fund Name *</label><input value={form.fundName} onChange={(e) => setForm({...form, fundName: e.target.value})} className="input-field !py-2.5 text-sm" required /></div>
                <div><label className="text-white/60 text-xs mb-1.5 block">AMC *</label><input value={form.amc} onChange={(e) => setForm({...form, amc: e.target.value})} className="input-field !py-2.5 text-sm" required /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs mb-1.5 block">Risk Level *</label><select value={form.riskLevel} onChange={(e) => setForm({...form, riskLevel: e.target.value})} className="input-field !py-2.5 text-sm">{risks.map(r => <option key={r} value={r} className="bg-navy-800">{r}</option>)}</select></div>
                <div><label className="text-white/60 text-xs mb-1.5 block">Category *</label><input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field !py-2.5 text-sm" required placeholder="e.g., Equity, Debt, Hybrid" /></div>
              </div>
              <div><label className="text-white/60 text-xs mb-1.5 block">Description *</label><textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field min-h-[80px] resize-none text-sm" required /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs mb-1.5 block">Returns</label><input value={form.returns} onChange={(e) => setForm({...form, returns: e.target.value})} className="input-field !py-2.5 text-sm" placeholder="e.g., 12% p.a." /></div>
                <div><label className="text-white/60 text-xs mb-1.5 block">Min Investment</label><input value={form.minInvestment} onChange={(e) => setForm({...form, minInvestment: e.target.value})} className="input-field !py-2.5 text-sm" placeholder="e.g., 500" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs mb-1.5 block">Image</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field !py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gold-400/10 file:text-gold-400 file:font-medium file:text-xs" /></div>
                <div className="flex items-end"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold-400" /><span className="text-white/60 text-sm">Active</span></label></div>
              </div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold flex-1">{saving ? <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin mx-auto" /> : (editing ? 'Update' : 'Create')}</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MutualFundManagement;
