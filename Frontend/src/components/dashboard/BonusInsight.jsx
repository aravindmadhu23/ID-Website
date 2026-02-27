import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Award } from 'lucide-react';

const LEVELS = [
    { id: 'L1', label: 'Level 1', min: 0, bonus: 0, color: 'bg-gray-100 text-gray-500' },
    { id: 'L2', label: 'Level 2', min: 200, bonus: 500, color: 'bg-blue-100 text-blue-700' },
    { id: 'L3', label: 'Level 3', min: 350, bonus: 1000, color: 'bg-indigo-100 text-indigo-700' },
    { id: 'L4', label: 'Level 4', min: 500, bonus: 2000, color: 'bg-purple-100 text-purple-700' },
    { id: 'L5', label: 'Level 5', min: 700, bonus: 3500, color: 'bg-amber-100 text-amber-700' },
];

const getLevel = (jobs) => {
    let level = LEVELS[0];
    for (const l of LEVELS) { if (jobs >= l.min) level = l; }
    return level;
};

const getNextLevel = (jobs) => {
    return LEVELS.find(l => l.min > jobs) || null;
};

const BonusInsight = ({ monthlyJobs = 0, earnedBonus = 0, onViewBreakdown }) => {
    const current = getLevel(monthlyJobs);
    const next = getNextLevel(monthlyJobs);
    const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
    const avgPerDay = monthlyJobs / (new Date().getDate() || 1);
    const projected = Math.round(avgPerDay * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());
    const projectedLevel = getLevel(projected);

    return (
        <div className="corporate-card p-6">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-amber-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Bonus Insight</h3>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${current.color}`}>
                    {current.id}
                </span>
            </div>

            <div className="space-y-3 mb-5">
                <Row label="Current Level" value={<span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${current.color}`}>{current.label}</span>} />
                <Row label="Min. Jobs Required" value={`${current.min} jobs`} />
                <Row label="Bonus Earned" value={<span className="text-emerald-600 font-bold">₹{earnedBonus.toLocaleString()}</span>} />
                <Row label="Projected This Month" value={`${projected} jobs`} />
                <Row label="Projected Level" value={<span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${projectedLevel.color}`}>{projectedLevel.label}</span>} />
            </div>

            {next && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2">
                        <Award size={14} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-800">
                            <strong>{next.min - monthlyJobs} more jobs</strong> to reach <strong>{next.label}</strong> (₹{next.bonus.toLocaleString()} bonus)
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={onViewBreakdown}
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
                View Full Breakdown <ChevronRight size={14} />
            </button>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-900">{value}</span>
    </div>
);

export default BonusInsight;
