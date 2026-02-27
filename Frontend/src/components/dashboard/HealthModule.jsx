import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Eye, Clock, Heart, X, Check } from 'lucide-react';

const useTimer = (initialSeconds, onComplete) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (running) {
            ref.current = setInterval(() => {
                setSeconds(s => {
                    if (s <= 1) { clearInterval(ref.current); setRunning(false); onComplete?.(); return initialSeconds; }
                    return s - 1;
                });
            }, 1000);
        }
        return () => clearInterval(ref.current);
    }, [running]);

    const toggle = () => setRunning(r => !r);
    const reset = () => { setRunning(false); setSeconds(initialSeconds); };
    const fmt = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    return { fmt, running, toggle, reset };
};

const HealthModule = () => {
    const [open, setOpen] = useState(false);
    const [waterCount, setWaterCount] = useState(0);
    const [shiftStart] = useState(Date.now());
    const [shiftTime, setShiftTime] = useState('00:00:00');

    const eyeTimer = useTimer(20 * 60, () => alert('Rest your eyes! Look 20 feet away for 20 seconds.'));
    const waterTimer = useTimer(60 * 60, () => alert('Time to drink water! 💧'));

    useEffect(() => {
        const iv = setInterval(() => {
            const elapsed = Math.floor((Date.now() - shiftStart) / 1000);
            const h = Math.floor(elapsed / 3600), m = Math.floor((elapsed % 3600) / 60), s = elapsed % 60;
            setShiftTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    return (
        <>
            {/* Floating trigger */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center"
                title="Health Module"
            >
                <Heart size={20} />
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-20 right-6 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Heart size={15} className="text-rose-500" />
                                <span className="text-sm font-bold text-gray-900">Health Module</span>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                        </div>

                        <div className="p-4 space-y-3">
                            {/* Shift Timer */}
                            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Clock size={15} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Shift Time</p>
                                    <p className="text-base font-bold text-gray-900 font-mono">{shiftTime}</p>
                                </div>
                            </div>

                            {/* 20-20-20 Eye Rest */}
                            <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Eye size={15} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Eye Rest (20-20-20)</p>
                                    <p className="text-sm font-bold text-gray-900 font-mono">{eyeTimer.fmt}</p>
                                </div>
                                <button
                                    onClick={eyeTimer.toggle}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${eyeTimer.running ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                                >
                                    {eyeTimer.running ? 'Pause' : 'Start'}
                                </button>
                            </div>

                            {/* Water Reminder */}
                            <div className="bg-cyan-50 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <Droplets size={15} className="text-cyan-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Water · {waterCount} glasses</p>
                                    <p className="text-sm font-bold text-gray-900 font-mono">{waterTimer.fmt}</p>
                                </div>
                                <button
                                    onClick={() => setWaterCount(c => c + 1)}
                                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-cyan-100 text-cyan-600 hover:bg-cyan-200 transition-colors"
                                >
                                    +1 💧
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HealthModule;
