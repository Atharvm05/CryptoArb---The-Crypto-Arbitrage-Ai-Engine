import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Logo from './Logo';
import {
  ArrowLeftRight,
  TrendingUp,
  LineChart,
  Calculator,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Funding Screener', icon: LayoutDashboard },
  { path: '/opportunities', label: 'Opportunities', icon: Zap },
  { path: '/spot-futures', label: 'Spot vs Futures', icon: ArrowLeftRight },
  { path: '/cross-exchange', label: 'Cross Exchange', icon: TrendingUp },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
];

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1321]/80 backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-white/5">
          <NavLink to="/" className="flex items-center">
            <Logo size={36} />
          </NavLink>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-4">
            <p className="text-xs text-emerald-300 font-medium">Live Data</p>
            <p className="text-[10px] text-gray-400 mt-1">Connected to 13+ exchanges</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] text-emerald-400">Real-time</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
