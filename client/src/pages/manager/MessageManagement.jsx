import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await contactAPI.getAll({ page, limit: 10 }); setMessages(data.messages); setTotalPages(data.pages); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleRead = async (msg) => {
    if (!msg.isRead) await contactAPI.markRead(msg._id).catch(() => {});
    setDetail(msg);
    fetchData();
  };

  const handleDelete = async (id) => {
    try { await contactAPI.delete(id); toast.success('Deleted!'); setDeleteConfirm(null); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Contact Messages</h2><p className="text-white/40 text-sm mt-1">Messages from the contact form</p></div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>
      : messages.length === 0 ? <div className="glass-card p-12 text-center"><MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" /><p className="text-white/40">No messages yet</p></div>
      : (
        <>
          <div className="space-y-3">
            {messages.map((msg) => (
              <motion.div key={msg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`glass-card p-5 cursor-pointer hover:border-gold-400/20 transition-all ${!msg.isRead ? 'border-l-2 border-l-gold-400' : ''}`}
                onClick={() => handleRead(msg)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{msg.name}</span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                    </div>
                    <p className="text-white/40 text-xs">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                    {msg.subject && <p className="text-white/60 text-sm mt-1">{msg.subject}</p>}
                    <p className="text-white/50 text-sm mt-1 line-clamp-1">{msg.message}</p>
                    <p className="text-white/30 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(msg._id); }}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 ml-4">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-white/60 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}
            className="glass-card-strong p-6 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-gold-400" />
              <h3 className="text-lg font-bold text-white">Message from {detail.name}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="text-white/40">Email:</span> <span className="text-white ml-2">{detail.email}</span></p>
              {detail.phone && <p><span className="text-white/40">Phone:</span> <span className="text-white ml-2">{detail.phone}</span></p>}
              {detail.subject && <p><span className="text-white/40">Subject:</span> <span className="text-white ml-2">{detail.subject}</span></p>}
              <div className="mt-4 p-4 bg-white/5 rounded-xl"><p className="text-white/70 whitespace-pre-wrap">{detail.message}</p></div>
              <p className="text-white/30 text-xs">{new Date(detail.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setDetail(null)} className="btn-outline w-full mt-6">Close</button>
          </motion.div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="glass-card-strong p-6 max-w-sm w-full text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-bold text-white mb-2">Delete Message?</h3>
            <div className="flex gap-3 mt-6"><button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 flex-1">Delete</button></div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;
