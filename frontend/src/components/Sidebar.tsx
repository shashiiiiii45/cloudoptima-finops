import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Server,
  TrendingUp,
  Lightbulb,
  Cpu,
  Bell,
  FileText,
  ShieldCheck,
  Settings,
  CloudLightning,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  user: { email: string; role: string } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  user,
  onLogout
}) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', name: 'Cost Analytics', icon: BarChart3 },
    { id: 'resources', name: 'AWS Resources', icon: Server },
    { id: 'forecasting', name: 'AI Forecasting', icon: TrendingUp },
    { id: 'recommendations', name: 'Recommendations', icon: Lightbulb, badge: '4' },
    { id: 'kubernetes', name: 'Kubernetes', icon: Cpu },
    { id: 'alerts', name: 'Alerts Center', icon: Bell, badge: '3', badgeColor: 'bg-brand-rose' },
    { id: 'reports', name: 'FinOps Reports', icon: FileText },
    { id: 'compliance', name: 'Compliance', icon: ShieldCheck },
    { id: 'admin', name: 'Admin Panel', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-obsidian-900 border-r border-white/5 flex flex-col justify-between z-20 font-sans">
      {/* Brand Logo */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-purple flex items-center justify-center shadow-glass-glow animate-pulse-slow">
            <CloudLightning className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-magenta bg-clip-text text-transparent">
              CloudOptima AI
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">FinOps Platform</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-teal/10 to-brand-purple/10 border-l-2 border-brand-teal text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-brand-teal' : 'text-gray-500 group-hover:text-brand-teal'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${
                      item.badgeColor || 'bg-brand-teal'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-white/5 bg-obsidian-950/50">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center font-bold text-white text-sm">
                {user.email.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-brand-teal font-medium uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-brand-rose/10 hover:text-brand-rose border border-white/10 hover:border-brand-rose/20 rounded-xl text-xs font-semibold text-gray-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-500">Not authenticated</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
