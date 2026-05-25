import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Container, Cpu, BarChart2, Zap, AlertTriangle, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

export const Kubernetes: React.FC = () => {
  // Namespace costs data
  const namespaceCosts = [
    { name: 'billing-prod', cost: 380, waste: 95 },
    { name: 'auth-prod', cost: 180, waste: 20 },
    { name: 'gateway-prod', cost: 240, waste: 30 },
    { name: 'logging', cost: 150, waste: 85 },
    { name: 'dev-sandbox', cost: 120, waste: 90 },
  ];

  // Pod limits vs actual CPU over 6 hours
  const podLimitData = [
    { hour: '12:00', Limit: 8.0, Request: 6.5, Actual: 2.1 },
    { hour: '13:00', Limit: 8.0, Request: 6.5, Actual: 2.3 },
    { hour: '14:00', Limit: 8.0, Request: 6.5, Actual: 4.8 }, // spike
    { hour: '15:00', Limit: 8.0, Request: 6.5, Actual: 2.4 },
    { hour: '16:00', Limit: 8.0, Request: 6.5, Actual: 1.9 },
    { hour: '17:00', Limit: 8.0, Request: 6.5, Actual: 2.0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Kubernetes (EKS) Monitoring</h2>
        <p className="text-gray-400 text-sm mt-1">Granular namespace-level cost mapping, container waste detection, and pod resource scaling.</p>
      </div>

      {/* Cluster Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/15 flex items-center justify-center border border-brand-teal/20">
            <Container className="w-5 h-5 text-brand-teal" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Active Nodes</span>
            <span className="text-xl font-bold text-white">12 EC2 Workers</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center border border-brand-purple/20">
            <Layers className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Active Pods</span>
            <span className="text-xl font-bold text-white">148 Pod Instances</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center border border-brand-green/20">
            <Cpu className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Allocated CPU</span>
            <span className="text-xl font-bold text-white">48 Cores (34% Utilized)</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3 bg-brand-rose/5 border border-brand-rose/10">
          <div className="w-10 h-10 rounded-xl bg-brand-rose/15 flex items-center justify-center border border-brand-rose/20">
            <AlertTriangle className="w-5 h-5 text-brand-rose" />
          </div>
          <div>
            <span className="text-[10px] text-brand-rose uppercase tracking-widest block font-bold">Wasted Spend</span>
            <span className="text-xl font-bold text-brand-rose font-mono">$320.00/mo</span>
          </div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Namespace Spend Chart */}
        <GlassCard className="min-h-[350px] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-teal" /> Namespace Cost & Resource Waste
            </h4>
            <p className="text-xs text-gray-400 mb-6">Compare actual namespace running costs against computed CPU idle waste.</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={namespaceCosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="cost" fill="#8a2be2" radius={[4, 4, 0, 0]} name="Running Cost ($)" />
                <Bar dataKey="waste" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Idle Waste ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pod Request vs Actual */}
        <GlassCard className="min-h-[350px] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-purple" /> Pod Resource Request vs Actual CPU
            </h4>
            <p className="text-xs text-gray-400 mb-6">Aggregate pods CPU requests and limits compared to live CPU ticks.</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={podLimitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Limit" stroke="#ff007f" strokeWidth={2} name="CPU Limit (Cores)" />
                <Line type="monotone" dataKey="Request" stroke="#8a2be2" strokeWidth={2} name="CPU Request" />
                <Line type="monotone" dataKey="Actual" stroke="#00f2fe" strokeWidth={2.5} name="Actual CPU" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recommendations Banner */}
      <GlassCard glow className="border-brand-rose/20 bg-brand-rose/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-brand-rose shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white">Kubernetes Under-utilization Alert (`dev-sandbox` & `logging`)</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              We detected that CPU resources in the `dev-sandbox` namespace are allocated at 8x the actual peak utilization.
              Apply rightsizing policies to save up to **$90.00/month** by reducing deployment replica counts.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert("Simulation EKS Action: Downsizing namespace deployment limits.")}
          className="px-4 py-2 bg-brand-rose hover:bg-brand-rose/85 text-obsidian-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          Downsize Deployments
        </button>
      </GlassCard>
    </motion.div>
  );
};

export default Kubernetes;
