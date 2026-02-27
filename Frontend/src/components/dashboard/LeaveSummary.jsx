import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaveSummary = ({ balance = 12, pending = 0, approved = 0 }) => {
    const navigate = useNavigate();

    return (
        <div className="corporate-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <CalendarDays size={16} className="text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Leave Summary</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                <Stat icon={<CalendarDays size={14} />} label="Balance" value={balance} color="text-blue-600" bg="bg-blue-50" />
                <Stat icon={<Clock size={14} />} label="Pending" value={pending} color="text-orange-500" bg="bg-orange-50" />
                <Stat icon={<CheckCircle2 size={14} />} label="Approved" value={approved} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            <button
                onClick={() => navigate('/leaves')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
                <Plus size={14} /> Apply Leave
            </button>
        </div>
    );
};

const Stat = ({ icon, label, value, color, bg }) => (
    <div className={`${bg} rounded-xl p-3 text-center`}>
        <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
        <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-500 mt-1">{label}</p>
    </div>
);

export default LeaveSummary;
