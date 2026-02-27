import React from 'react';
import { LayoutDashboard, Calendar, Bell, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'leaves', label: 'Leaves', icon: <Calendar size={20} /> }
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-2 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r md:p-4 z-50">
            <div className="hidden md:flex items-center gap-3 mb-10 px-2 text-blue-700 mt-2">
                <ShieldCheck size={28} className="fill-blue-100" />
                <span className="text-xl font-black tracking-tighter uppercase italic">NexusPortal</span>
            </div>

            <ul className="flex justify-around md:flex-col gap-1">
                {navItems.map((item) => (
                    <li key={item.id} className="flex-1 md:flex-none">
                        <button
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {item.icon}
                            <span className="text-[10px] md:text-sm font-bold">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;
