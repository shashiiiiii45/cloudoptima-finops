import React, { useState } from 'react';
import { useFinOps, CloudResource } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { Search, Server, Database, Container, Flame, Play, Square, Settings, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Resources: React.FC = () => {
  const { resources, applyRecommendation } = useFinOps();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<CloudResource | null>(null);

  // Filter logic
  const filtered = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || res.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-green/10 border border-brand-green/20 text-brand-green font-semibold">Active</span>;
      case 'stopped':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-500/10 border border-gray-500/20 text-gray-400 font-semibold">Stopped</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-amber/10 border border-brand-amber/20 text-brand-amber font-semibold">{status}</span>;
    }
  };

  const handleAction = async (res: CloudResource) => {
    if (res.is_idle && res.type === 'ec2') {
      // Find recommendation ID that matches this resource
      // Mock ID 1 is for EC2 Stop Idle
      await applyRecommendation(1);
      // Close side panel
      setSelectedResource(null);
    } else if (res.is_idle && res.type === 'rds') {
      // Mock ID 2 is for RDS downsize
      await applyRecommendation(2);
      setSelectedResource(null);
    } else {
      alert("Autoscaling simulation action sent to AWS Auto Scaling scaling-group.");
    }
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
        <h2 className="text-3xl font-bold text-white tracking-tight">Active AWS Resources</h2>
        <p className="text-gray-400 text-sm mt-1">Live telemetry, instance sizes, and real-time waste analysis.</p>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard hover={false} className="flex flex-wrap justify-between items-center gap-4 py-4 px-6">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resource ID, service name, or DNS..."
            className="w-full pl-10 pr-4 py-2 bg-obsidian-950/60 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none placeholder-gray-500"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'ec2', 'rds', 's3', 'eks'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${
                filterType === type
                  ? 'bg-brand-teal text-obsidian-950 shadow-glass-glow'
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Table List */}
        <div className="xl:col-span-2 space-y-4">
          <GlassCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-obsidian-950 text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-4 px-6">Resource Name</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Region</th>
                    <th className="py-4 px-6 text-center">CPU %</th>
                    <th className="py-4 px-6 text-right">Cost/Hr</th>
                    <th className="py-4 px-6 text-center">Waste Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((res) => {
                    const isEks = res.type === 'eks';
                    const isS3 = res.type === 's3';
                    return (
                      <tr
                        key={res.resource_id}
                        onClick={() => setSelectedResource(res)}
                        className={`hover:bg-white/5 transition-all cursor-pointer ${
                          selectedResource?.resource_id === res.resource_id ? 'bg-brand-teal/5 border-l-2 border-brand-teal' : ''
                        }`}
                      >
                        <td className="py-4 px-6 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              {res.type === 'ec2' ? <Server className="w-4 h-4 text-brand-teal" /> :
                               res.type === 'rds' ? <Database className="w-4 h-4 text-brand-purple" /> :
                               <Container className="w-4 h-4 text-brand-magenta" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white truncate max-w-[150px]">{res.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono truncate max-w-[150px]">{res.resource_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs uppercase font-medium">{res.type}</td>
                        <td className="py-4 px-6 text-xs text-gray-400 font-mono">{res.region}</td>
                        <td className="py-4 px-6 text-center font-mono">
                          {isS3 ? '-' : (
                            <span className={`font-semibold ${res.cpu_utilization > 70 ? 'text-brand-rose' : res.cpu_utilization < 5 ? 'text-brand-amber font-bold' : 'text-brand-green'}`}>
                              {res.cpu_utilization}%
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right text-white font-mono font-bold">${res.cost_per_hour.toFixed(3)}</td>
                        <td className="py-4 px-6 text-center">
                          {res.is_idle ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose rounded-full font-bold uppercase tracking-wider animate-pulse">
                              <Flame className="w-3.5 h-3.5" /> IDLE
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500">Optimal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Resource Details Side Drawer */}
        <AnimatePresence>
          {selectedResource && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              <GlassCard glow className="space-y-6 border-brand-teal/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Resource Profile</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Instance runtime stats and FinOps suggestions.</p>
                  </div>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-500">Name</span>
                    <span className="text-xs font-bold text-white">{selectedResource.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-500">Resource ID</span>
                    <span className="text-xs font-mono text-white">{selectedResource.resource_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-500">Status</span>
                    <span>{getStatusBadge(selectedResource.status)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-500">Hourly Rate</span>
                    <span className="text-xs font-bold font-mono text-brand-teal">${selectedResource.cost_per_hour.toFixed(3)}/hr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-500">Monthly Run Rate</span>
                    <span className="text-xs font-bold font-mono text-white">${(selectedResource.cost_per_hour * 730).toFixed(2)}/mo</span>
                  </div>
                  {selectedResource.type !== 's3' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-xs text-gray-500">Average CPU</span>
                        <span className="text-xs font-bold font-mono text-white">{selectedResource.cpu_utilization}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-xs text-gray-500">Average Memory</span>
                        <span className="text-xs font-bold font-mono text-white">{selectedResource.memory_utilization}%</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Micro-telemetry Graph Placeholder */}
                {selectedResource.type !== 's3' && (
                  <div className="p-4 bg-obsidian-950/80 rounded-xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-brand-teal" /> Utilization Profile
                    </p>
                    <div className="h-16 flex items-end gap-1.5 pt-2">
                      {[32, 28, 45, 52, 60, selectedResource.cpu_utilization].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-sm ${selectedResource.is_idle ? 'bg-brand-amber/30' : 'bg-brand-teal/30'}`}
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Idle Remediation Action Button */}
                {selectedResource.is_idle ? (
                  <div className="space-y-3 bg-brand-rose/5 border border-brand-rose/20 rounded-xl p-4">
                    <p className="text-xs text-brand-rose font-bold">⚠️ Idle Resource Detected</p>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      This instance is underutilized. Click below to automate the FinOps shutdown recommendations immediately.
                    </p>
                    <button
                      onClick={() => handleAction(selectedResource)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-brand-rose hover:bg-brand-rose/85 text-obsidian-950 font-bold text-xs rounded-lg transition-colors"
                    >
                      <Square className="w-4 h-4 fill-obsidian-950" />
                      Decommission Instance
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Simulation: Scale request dispatched.")}
                      className="flex-1 py-2 bg-white/5 border border-white/10 text-white font-bold text-xs rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Scale Options
                    </button>
                    <button
                      onClick={() => alert("Simulation: Terminal session started.")}
                      className="flex-1 py-2 bg-brand-teal hover:bg-brand-teal/85 text-obsidian-950 font-bold text-xs rounded-lg transition-colors"
                    >
                      Connect Shell
                    </button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Resources;
