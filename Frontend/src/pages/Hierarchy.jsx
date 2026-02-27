import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';

const HIERARCHY = [
    { role: 'CEO', name: 'Executive Director', level: 1 },
    { role: 'Group Manager', name: 'Operations Head', level: 2 },
    { role: 'Art Manager', name: 'Creative Production', level: 3 },
    { role: 'QA Manager', name: 'Quality Assurance Head', level: 3 },
    { role: 'Team Lead', name: 'Vector Unit Lead', level: 4 },
    { role: 'Associate TL', name: 'Shift Supervisor', level: 5 },
    { role: 'Senior Employee', name: 'Lead Artist', level: 6 },
    { role: 'Junior Employee', name: 'Production Artist', level: 7 },
    { role: 'Intern', name: 'Design Intern', level: 8 },
];

const LEVEL_COLORS = {
    1: 'bg-indigo-600 text-white',
    2: 'bg-indigo-500 text-white',
    3: 'bg-indigo-400 text-white',
    4: 'bg-blue-400 text-white',
    5: 'bg-blue-300 text-blue-900',
    6: 'bg-slate-200 text-slate-700',
    7: 'bg-slate-100 text-slate-600',
    8: 'bg-gray-100 text-gray-500',
};

const Hierarchy = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Organizational Hierarchy</h1>
                <p className="text-sm text-gray-500 mt-1">Reporting structure across the company</p>
            </div>

            <div className="corporate-card p-8">
                <div className="space-y-3">
                    {HIERARCHY.map((emp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4"
                            style={{ marginLeft: `${(emp.level - 1) * 2.5}rem` }}
                        >
                            {/* Connector line */}
                            {emp.level > 1 && (
                                <div className="w-1 h-8 bg-gray-200 rounded-full shrink-0" />
                            )}

                            {/* Card */}
                            <div className="corporate-card flex-1 max-w-lg p-4 flex items-center justify-between group cursor-default hover:border-indigo-300">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${LEVEL_COLORS[emp.level] || 'bg-gray-100 text-gray-500'}`}>
                                        {emp.level}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">{emp.role}</p>
                                        <p className="text-sm font-semibold text-gray-800 leading-none">{emp.name}</p>
                                    </div>
                                </div>
                                <Users size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Hierarchy;