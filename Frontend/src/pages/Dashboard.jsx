import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase, TrendingUp, XCircle, DollarSign,
    CalendarCheck, PenLine, Plus, ChevronRight, Save, Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

import KPICard from '../components/dashboard/KPICard';
import TargetProgress from '../components/dashboard/TargetProgress';
import BonusInsight from '../components/dashboard/BonusInsight';
import LeaveSummary from '../components/dashboard/LeaveSummary';
import AnnouncementFeed from '../components/dashboard/AnnouncementFeed';
import HealthModule from '../components/dashboard/HealthModule';

// Fake sparkline generator (fills until real data available)
const spark = (base, len = 7) =>
    Array.from({ length: len }, (_, i) => Math.max(0, base + Math.round((Math.random() - 0.45) * base * 0.4)));

const DAILY_TARGET = 450;

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todayJobs: 0, monthlyTotalJobs: 0, monthlyTotalBonus: 0, leaveCount: 0
    });
    const [announcements, setAnnouncements] = useState([]);
    const [leaveStats, setLeaveStats] = useState({ balance: 12, pending: 0, approved: 0 });
    const [workEntry, setWorkEntry] = useState({
        jobsCompleted: '',
        workDate: new Date().toISOString().split('T')[0],
    });
    const [todaySubmitted, setTodaySubmitted] = useState(false);
    const [workLoading, setWorkLoading] = useState(false);
    const [workFeedback, setWorkFeedback] = useState(null);
    const [showBonusBreakdown, setShowBonusBreakdown] = useState(false);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, annRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/announcements'),
            ]);
            setStats(statsRes.data);
            setAnnouncements(annRes.data);

            // Try fetch leave stats
            try {
                const leavesRes = await api.get('/leaves/my');
                const leaves = leavesRes.data;
                setLeaveStats({
                    balance: 12 - leaves.filter(l => l.Status === 'Approved').length,
                    pending: leaves.filter(l => l.Status === 'Pending').length,
                    approved: leaves.filter(l => l.Status === 'Approved').length,
                });
            } catch { }

            // Check if today's entry exists
            const today = new Date().toISOString().split('T')[0];
            setTodaySubmitted(!!statsRes.data.todayJobs);
        } catch (err) {
            console.error('Dashboard load failed:', err);
        }
    };

    const bonusPreview = (() => {
        const jobs = parseInt(workEntry.jobsCompleted) || 0;
        if (jobs <= DAILY_TARGET) return 0;
        return Math.round((jobs - DAILY_TARGET) * 2.5); // ₹2.5 per extra job
    })();

    const handleWorkSubmit = async (e) => {
        e.preventDefault();
        setWorkLoading(true);
        setWorkFeedback(null);
        try {
            await api.post('/work/submit', {
                jobsCompleted: parseInt(workEntry.jobsCompleted),
                workDate: workEntry.workDate,
            });
            setWorkFeedback({ type: 'success', message: 'Work entry saved!' });
            setTodaySubmitted(true);
            fetchAll();
            setWorkEntry({ ...workEntry, jobsCompleted: '' });
        } catch (err) {
            setWorkFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to save entry.' });
        } finally {
            setWorkLoading(false);
        }
    };

    const remaining = Math.max(DAILY_TARGET - (parseInt(workEntry.jobsCompleted) || stats.todayJobs), 0);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl">

            {/* ── PAGE HEADER ── */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Performance Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
                        <span className="capitalize font-medium text-indigo-600">{user?.role}</span>
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                        onClick={() => document.getElementById('work-entry-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all"
                    >
                        <Plus size={14} /> Add Today's Work
                    </button>
                    <button
                        onClick={() => navigate('/leaves')}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
                    >
                        <CalendarCheck size={14} /> Apply Leave
                    </button>
                    <button
                        onClick={() => setShowBonusBreakdown(true)}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700 hover:text-amber-600 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
                    >
                        <DollarSign size={14} /> View Bonus
                    </button>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    title="Today's Jobs"
                    value={stats.todayJobs}
                    unit="jobs"
                    trend={stats.todayJobs >= DAILY_TARGET ? 8 : -5}
                    trendLabel={`Target: ${DAILY_TARGET} jobs/day`}
                    sparkData={spark(stats.todayJobs)}
                    color="indigo"
                    icon={<Briefcase size={16} />}
                    breakdown={[
                        { label: 'Jobs Done', value: stats.todayJobs },
                        { label: 'Daily Target', value: DAILY_TARGET },
                        { label: 'Remaining', value: Math.max(0, DAILY_TARGET - stats.todayJobs) },
                        { label: 'Status', value: stats.todayJobs >= DAILY_TARGET ? '✅ Target Hit' : '⏳ In Progress' },
                    ]}
                />
                <KPICard
                    title="Monthly Jobs"
                    value={stats.monthlyTotalJobs}
                    unit="jobs"
                    trend={12}
                    trendLabel="vs last month"
                    sparkData={spark(stats.monthlyTotalJobs / 30)}
                    color="blue"
                    icon={<TrendingUp size={16} />}
                    breakdown={[
                        { label: 'Total This Month', value: stats.monthlyTotalJobs },
                        { label: 'Monthly Target', value: DAILY_TARGET * 26 },
                        { label: 'Daily Average', value: Math.round(stats.monthlyTotalJobs / (new Date().getDate() || 1)) },
                    ]}
                />
                <KPICard
                    title="QA Rejections"
                    value="0"
                    unit="this month"
                    trend={0}
                    trendLabel="Keep it up!"
                    sparkData={[0, 0, 1, 0, 0, 0, 0]}
                    color="red"
                    icon={<XCircle size={16} />}
                />
                <KPICard
                    title="Monthly PRP Bonus"
                    value={`₹${stats.monthlyTotalBonus?.toLocaleString() || 0}`}
                    trend={stats.monthlyTotalBonus > 0 ? 15 : 0}
                    trendLabel="Projected this cycle"
                    sparkData={spark(stats.monthlyTotalBonus / 100)}
                    color="emerald"
                    icon={<DollarSign size={16} />}
                    breakdown={[
                        { label: 'Bonus Earned', value: `₹${stats.monthlyTotalBonus?.toLocaleString() || 0}` },
                        { label: 'Bonus Rate', value: '₹2.50 / extra job' },
                        { label: 'Min Target', value: `${DAILY_TARGET} jobs/day` },
                    ]}
                />
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN — 8 cols */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Today's Work Entry */}
                    <div id="work-entry-section" className="corporate-card p-6 border-2 border-indigo-100 bg-indigo-50/30">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <PenLine size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Today's Work Entry</h3>
                                <p className="text-[10px] text-gray-500">
                                    {workEntry.workDate} · Minimum target: <strong>{DAILY_TARGET} jobs</strong>
                                </p>
                            </div>
                            {todaySubmitted && (
                                <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                                    ✓ Submitted
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleWorkSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Work Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                        value={workEntry.workDate}
                                        onChange={e => setWorkEntry({ ...workEntry, workDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Jobs Completed</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder={`Enter jobs (target: ${DAILY_TARGET})`}
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                        value={workEntry.jobsCompleted}
                                        onChange={e => setWorkEntry({ ...workEntry, jobsCompleted: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Live Bonus Preview */}
                            {workEntry.jobsCompleted && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-3 gap-3"
                                >
                                    <PreviewPill
                                        label="Jobs Entered"
                                        value={workEntry.jobsCompleted}
                                        color="bg-indigo-50 text-indigo-700"
                                    />
                                    <PreviewPill
                                        label="To Target"
                                        value={remaining > 0 ? `${remaining} more` : '✅ Hit!'}
                                        color={remaining === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}
                                    />
                                    <PreviewPill
                                        label="Bonus Preview"
                                        value={bonusPreview > 0 ? `₹${bonusPreview}` : '—'}
                                        color={bonusPreview > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400'}
                                    />
                                </motion.div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={workLoading}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
                                >
                                    <Save size={14} />
                                    {workLoading ? 'Saving...' : todaySubmitted ? 'Update Entry' : 'Save Entry'}
                                </button>
                                {workFeedback && (
                                    <span className={`text-xs font-medium ${workFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {workFeedback.message}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Target Progress */}
                    <TargetProgress
                        completed={stats.monthlyTotalJobs}
                        target={DAILY_TARGET * 26}
                        label="Monthly Target Progress"
                    />

                    {/* Announcements */}
                    <AnnouncementFeed announcements={announcements} />
                </div>

                {/* RIGHT COLUMN — 4 cols */}
                <div className="lg:col-span-4 space-y-6">
                    <BonusInsight
                        monthlyJobs={stats.monthlyTotalJobs}
                        earnedBonus={stats.monthlyTotalBonus || 0}
                        onViewBreakdown={() => setShowBonusBreakdown(true)}
                    />
                    <LeaveSummary
                        balance={leaveStats.balance}
                        pending={leaveStats.pending}
                        approved={leaveStats.approved}
                    />
                </div>
            </div>

            {/* Floating Health Module */}
            <HealthModule />
        </motion.div>
    );
};

const PreviewPill = ({ label, value, color }) => (
    <div className={`${color} rounded-xl p-3 text-center`}>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 opacity-70">{label}</p>
        <p className="text-sm font-bold">{value}</p>
    </div>
);

export default Dashboard;