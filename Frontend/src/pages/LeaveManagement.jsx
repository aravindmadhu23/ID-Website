import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, CalendarDays, Clock, ChevronRight } from 'lucide-react';
import api from '../api/api';

const LEAVE_TYPES = ['Annual', 'Sick', 'Personal', 'Maternity/Paternity'];

const STATUS_STYLES = {
    Approved: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-red-50 text-red-700',
    Pending: 'bg-orange-50 text-orange-700',
};

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({ startDate: '', endDate: '', leaveType: 'Annual', reason: '' });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves/my');
            setLeaves(res.data);
        } catch (err) { console.error('Failed to fetch leaves', err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);
        try {
            await api.post('/leaves/request', formData);
            setFeedback({ type: 'success', message: 'Leave request submitted successfully!' });
            fetchLeaves();
            setFormData({ startDate: '', endDate: '', leaveType: 'Annual', reason: '' });
        } catch (err) {
            setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to submit leave request.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <p className="text-sm text-gray-500 mt-1">Request and track your time off</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── REQUEST FORM ── */}
                <div className="lg:col-span-1">
                    <div className="corporate-card p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <Send className="text-indigo-600" size={16} />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Request Leave</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Leave Type</label>
                                <select
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                    value={formData.leaveType}
                                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                >
                                    {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {['startDate', 'endDate'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                            {field === 'startDate' ? 'Start' : 'End'} Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                            value={formData[field]}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Reason (Optional)</label>
                                <textarea
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all resize-none min-h-[90px]"
                                    placeholder="Briefly explain your reason..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={14} />
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>

                        {feedback && (
                            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                                {feedback.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── LEAVE HISTORY ── */}
                <div className="lg:col-span-2">
                    <div className="corporate-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <CalendarDays className="text-indigo-600" size={16} />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Leave History</h2>
                        </div>

                        {leaves.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Clock size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No leave requests yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {leaves.map((leave) => (
                                    <motion.div
                                        key={leave.Id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="corporate-card p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                                <CalendarDays size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{leave.LeaveType}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(leave.StartDate).toLocaleDateString()} → {new Date(leave.EndDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[leave.Status] || STATUS_STYLES.Pending}`}>
                                                {leave.Status}
                                            </span>
                                            <span className="text-[10px] text-gray-400">{new Date(leave.CreatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LeaveManagement;
