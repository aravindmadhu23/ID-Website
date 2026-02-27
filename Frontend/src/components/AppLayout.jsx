import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, CalendarDays,
    LogOut, CheckCircle, Bell, Search
} from 'lucide-react';
import api from '../api/api';

const NAV_ITEMS = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/hierarchy', icon: <Users size={18} />, label: 'Team Hierarchy' },
    { to: '/leaves', icon: <CalendarDays size={18} />, label: 'Leave Management' },
];

const AppLayout = ({ children, user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) { /* silent */ }
        localStorage.removeItem('user');
        navigate('/');
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">

            {/* ── SIDEBAR ── */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 sticky top-0 h-screen shrink-0">

                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">iDYNAMICS</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="mt-auto border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs shrink-0">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">{user?.role || 'Employee'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors font-semibold text-sm px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <Bell size={20} className="text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" />
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
