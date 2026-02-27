import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

// Mini sparkline using SVG
const Sparkline = ({ data = [], color = '#6366f1' }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const w = 80, h = 32;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} className="opacity-70">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const KPICard = ({ title, value, unit, trend, trendLabel, sparkData, color = 'indigo', icon, breakdown }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const isPositive = trend >= 0;
    const colorMap = {
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', spark: '#6366f1', badge: 'bg-indigo-100 text-indigo-700' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', spark: '#3b82f6', badge: 'bg-blue-100 text-blue-700' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', spark: '#10b981', badge: 'bg-emerald-100 text-emerald-700' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', spark: '#f97316', badge: 'bg-orange-100 text-orange-700' },
        red: { bg: 'bg-red-50', text: 'text-red-600', spark: '#ef4444', badge: 'bg-red-100 text-red-700' },
    };
    const c = colorMap[color] || colorMap.indigo;

    return (
        <>
            <motion.div
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => breakdown && setShowBreakdown(true)}
                className={`corporate-card p-5 cursor-pointer select-none ${breakdown ? 'hover:border-indigo-300' : ''}`}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center ${c.text}`}>
                        {icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {isPositive ? '+' : ''}{trend}%
                    </span>
                </div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
                        {unit && <span className="text-xs text-gray-400 ml-1">{unit}</span>}
                    </div>
                    <Sparkline data={sparkData || []} color={c.spark} />
                </div>

                {trendLabel && (
                    <p className="text-[10px] text-gray-400 mt-2">{trendLabel}</p>
                )}
                {breakdown && (
                    <p className="text-[10px] text-indigo-500 font-semibold mt-2">Click for breakdown →</p>
                )}
            </motion.div>

            {/* Breakdown Modal */}
            <AnimatePresence>
                {showBreakdown && breakdown && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowBreakdown(false)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900">{title} Breakdown</h3>
                                <button onClick={() => setShowBreakdown(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {breakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default KPICard;
