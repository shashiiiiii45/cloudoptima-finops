import React, { useState, useEffect } from 'react';
import { useFinOps } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { Users, Key, Terminal, ShieldAlert, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Admin: React.FC = () => {
  const { user } = useFinOps();
  const [roleArn, setRoleArn] = useState('arn:aws:iam::123456789012:role/CloudOptimaFinOpsCrossAccountRole');
  const [externalId, setExternalId] = useState('c9f1a23b-4c5d-6e7f-8g9h-0i1j2k3l4m5n');
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Bootstrapping telemetry collector services...',
    '[AWS] Cost Explorer sync cycle complete. Processed 2,480 daily billing entries.',
    '[AI] Forecast engine Prophet re-fit successful. Updated 30-day savings predictions.',
    '[SYSTEM] WebSocket gateway listening on port 3001...'
  ]);

  const usersList = [
    { email: 'admin@cloudoptima.com', role: 'Admin', status: 'Active' },
    { email: 'finance@cloudoptima.com', role: 'Finance', status: 'Active' },
    { email: 'engineer@cloudoptima.com', role: 'User', status: 'Active' },
  ];

  // Simulating live console log output
  useEffect(() => {
    const timer = setInterval(() => {
      const activities = [
        '[AWS] Telemetry scan: i-09f1a23b4c5d6e7f8 (prod-auth-service) CPU utilization 4.2% -> IDLE alert remains.',
        '[SYSTEM] Clean cache database indices complete.',
        '[AI] Anomaly detection window refreshed. Standard deviation threshold: $365.00.',
        '[AWS] CloudWatch Metric scan dispatched for region: us-east-1.',
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${randomActivity}`]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ADMIN] Updated AWS IAM Credentials metadata. Dispatched verification handshake.`]);
    alert("IAM Credentials Saved: Triggered AWS Security Token Service (STS) connection test. Status: Connected.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">FinOps Administration</h2>
        <p className="text-gray-400 text-sm mt-1">Configure credentials integrations, adjust RBAC parameters, and monitor diagnostic logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Users List & IAM Settings */}
        <div className="space-y-6">
          {/* User Management */}
          <GlassCard className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-teal" /> RBAC & Users
              </h4>
              <button
                onClick={() => alert("Simulation: Add new user modal.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-brand-teal/10 hover:text-brand-teal border border-white/10 hover:border-brand-teal/20 text-xs font-bold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead className="bg-obsidian-950 text-gray-500 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((usr, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-semibold">{usr.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-brand-purple font-semibold text-[10px]">
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-brand-green font-bold">{usr.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Credentials Integration */}
          <GlassCard className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-purple" /> AWS IAM Integration Setup
            </h4>
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cross-Account Role ARN</label>
                <input
                  type="text"
                  value={roleArn}
                  onChange={(e) => setRoleArn(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-950 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">STS External ID</label>
                <input
                  type="text"
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-950 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal/85 text-obsidian-950 font-bold text-xs rounded-xl transition-all shadow-glass-glow flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Save & Verify Credentials
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: Console logs */}
        <GlassCard className="flex flex-col h-[500px]">
          <div className="mb-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-teal" /> Live Activity Log Console
            </h4>
            <p className="text-xs text-gray-400">Diagnostic message streams tracking API integration telemetry and forecasting re-fits.</p>
          </div>
          <div className="flex-1 bg-obsidian-950/80 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-brand-teal overflow-y-auto space-y-2 select-text">
            {logs.map((log, idx) => {
              let color = 'text-brand-teal';
              if (log.includes('[SYSTEM]')) color = 'text-brand-purple';
              else if (log.includes('[AWS]')) color = 'text-brand-teal';
              else if (log.includes('[AI]')) color = 'text-brand-green';
              else if (log.includes('alert') || log.includes('spike') || log.includes('[ADMIN]')) color = 'text-brand-rose font-bold';

              return (
                <div key={idx} className={`${color} leading-relaxed whitespace-pre-line`}>
                  {log}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Admin;
