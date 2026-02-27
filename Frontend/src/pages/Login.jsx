import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../api/api';

const QUICK_LOGINS = [
    { label: 'Art Designer', email: 'designer@id.com', color: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' },
    { label: 'QA Specialist', email: 'qa@id.com', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
    { label: 'Admin', email: 'admin@id.com', color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },
];

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (quickEmail) => {
        setEmail(quickEmail);
        setPassword('password123');
        setError('');
    };

    return (
        <div className="flex h-screen items-center justify-center p-4 bg-[#F9FAFB]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] bg-white border border-gray-200 rounded-2xl p-10 shadow-sm"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm mb-5">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">iDynamics Portal</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="email"
                                required
                                placeholder="name@idynamics.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <LogIn size={16} />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Quick Login */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Login</p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_LOGINS.map((ql) => (
                            <button
                                key={ql.email}
                                type="button"
                                onClick={() => handleQuickLogin(ql.email)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${ql.color}`}
                            >
                                {ql.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Click to auto-fill → then press Sign In</p>
                </div>

                <p className="mt-6 text-center text-[10px] text-gray-400">© 2026 iDynamics Ltd. All rights reserved.</p>
            </motion.div>
        </div>
    );
};

export default Login;