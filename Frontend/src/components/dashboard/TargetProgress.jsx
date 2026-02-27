import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';

const TargetProgress = ({ completed = 0, target = 450, label = 'Monthly Target Progress' }) => {
    const pct = Math.min(Math.round((completed / target) * 100), 100);
    const remaining = Math.max(target - completed, 0);
    const [animPct, setAnimPct] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimPct(pct), 300);
        return () => clearTimeout(timer);
    }, [pct]);

    const colorClass = pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-blue-500' : pct >= 40 ? 'bg-indigo-500' : 'bg-orange-400';
    const statusLabel = pct >= 100 ? 'Target Achieved! 🎉' : pct >= 70 ? 'On Track' : pct >= 40 ? 'In Progress' : 'Getting Started';

    return (
        <div className="corporate-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Target size={16} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{label}</h3>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${pct >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {statusLabel}
                </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${animPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                {/* Target markers at 25%, 50%, 75% */}
                {[25, 50, 75].map(m => (
                    <div key={m} className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${m}%` }} />
                ))}
            </div>

            <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span><strong className="text-gray-900">{completed}</strong> jobs done</span>
                <span className="font-bold text-gray-900">{pct}%</span>
                <span>Target: <strong className="text-gray-900">{target}</strong></span>
            </div>

            {remaining > 0 && (
                <div className="bg-indigo-50 rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
                    <p className="text-xs text-indigo-700">
                        <strong>{remaining} more jobs</strong> to hit your monthly target
                    </p>
                </div>
            )}
        </div>
    );
};

export default TargetProgress;
