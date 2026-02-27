import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Pin, ChevronRight } from 'lucide-react';

const CATEGORY_STYLES = {
    Art: 'bg-purple-50 text-purple-700',
    QA: 'bg-emerald-50 text-emerald-700',
    HR: 'bg-blue-50 text-blue-700',
    General: 'bg-gray-100 text-gray-600',
};

const AnnouncementFeed = ({ announcements = [] }) => {
    const [showAll, setShowAll] = useState(false);

    // Pinned items first
    const sorted = useMemo(() => [...announcements].sort((a, b) => (b.IsPinned ? 1 : 0) - (a.IsPinned ? 1 : 0)), [announcements]);
    const visible = showAll ? sorted : sorted.slice(0, 3);

    return (
        <div className="corporate-card p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Megaphone size={16} className="text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Announcements</h3>
                </div>
                {announcements.length > 3 && (
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {showAll ? 'Show Less' : `View All (${announcements.length})`}
                    </button>
                )}
            </div>

            {visible.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No announcements yet.</p>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {visible.map((ann, i) => {
                            const cat = ann.Category || (ann.IsPinned ? 'General' : 'General');
                            return (
                                <motion.div
                                    key={ann.Id || i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`corporate-card p-4 flex items-center justify-between group cursor-pointer ${ann.IsPinned ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {ann.IsPinned && <Pin size={13} className="text-indigo-500 mt-0.5 shrink-0" />}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${CATEGORY_STYLES[cat] || CATEGORY_STYLES.General}`}>
                                                    {cat}
                                                </span>
                                                {ann.IsPinned && (
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">Pinned</span>
                                                )}
                                                <span className="text-[10px] text-gray-400">
                                                    {ann.CreatedAt ? new Date(ann.CreatedAt).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{ann.Title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ann.Content}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={15} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AnnouncementFeed;
