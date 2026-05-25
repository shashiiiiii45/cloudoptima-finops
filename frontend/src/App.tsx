import React, { useState } from 'react';
import { FinOpsProvider, useFinOps } from './context/FinOpsContext';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';

// Page imports
import Overview from './pages/Overview';
import CostAnalytics from './pages/CostAnalytics';
import Resources from './pages/Resources';
import Forecasting from './pages/Forecasting';
import Recommendations from './pages/Recommendations';
import Kubernetes from './pages/Kubernetes';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Compliance from './pages/Compliance';
import Admin from './pages/Admin';

import { CloudLightning, Lock, User as UserIcon, Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activePage, setActivePage, user, logout } = useFinOps();

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <CostAnalytics />;
      case 'resources':
        return <Resources />;
      case 'forecasting':
        return <Forecasting />;
      case 'recommendations':
        return <Recommendations />;
      case 'kubernetes':
        return <Kubernetes />;
      case 'alerts':
        return <Alerts />;
      case 'reports':
        return <Reports />;
      case 'compliance':
        return <Compliance />;
      case 'admin':
        return <Admin />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex bg-obsidian-950 min-h-screen text-gray-100 select-none">
      {/* Navigation sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} onLogout={logout} />
      
      {/* Main dashboard content panel */}
      <main className="flex-1 pl-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-16">
          {renderPage()}
        </div>
      </main>

      {/* Floating AI Copilot Chatbot */}
      <Chatbot />
    </div>
  );
};

const LoginScreen: React.FC = () => {
  const { login } = useFinOps();
  const [email, setEmail] = useState('admin@cloudoptima.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate short network delay
    setTimeout(async () => {
      await login(email, role);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-screen bg-obsidian-950 flex flex-col justify-center items-center relative overflow-hidden font-sans select-none">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

      {/* Login Card */}
      <div className="w-[420px] glass-panel rounded-3xl p-8 border border-white/5 shadow-glass-glow relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-purple flex items-center justify-center shadow-glass-glow mb-4">
          <CloudLightning className="w-7 h-7 text-white" />
        </div>
        
        <h2 className="text-xl font-bold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-magenta bg-clip-text text-transparent">
          Sign in to CloudOptima AI
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-8 uppercase tracking-widest">Enterprise FinOps Terminal</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Corporate Email</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-obsidian-950/60 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none placeholder-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Access Token / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-obsidian-950/60 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none placeholder-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned FinOps Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-obsidian-950/60 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="Admin">Administrator (Admin)</option>
              <option value="Finance">Financial Auditor (Finance)</option>
              <option value="User">DevOps Engineer (User)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-teal hover:bg-brand-teal/90 text-obsidian-950 font-bold text-xs rounded-xl transition-all shadow-glass-glow mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Access Terminal
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-gray-400 leading-relaxed text-center w-full">
          <p className="font-semibold text-brand-teal mb-0.5">Demo Mode Active</p>
          You can use any credentials to sign in. Default passwords will pass automatically.
        </div>
      </div>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  const { user } = useFinOps();
  return user ? <DashboardContent /> : <LoginScreen />;
};

export const App: React.FC = () => {
  return (
    <FinOpsProvider>
      <AppWrapper />
    </FinOpsProvider>
  );
};

export default App;
