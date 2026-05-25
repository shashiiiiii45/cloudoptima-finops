import React, { useState } from 'react';
import { useFinOps } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldAlert, Compass, Layers, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export const CostAnalytics: React.FC = () => {
  const { costs } = useFinOps();
  const [provider, setProvider] = useState<'ALL' | 'AWS' | 'GCP' | 'Azure'>('ALL');
  const [metricType, setMetricType] = useState<'amortized' | 'unblended'>('amortized');

  // Filter costs based on selection
  const filteredCosts = costs.filter(c => !c.isForecast && (provider === 'ALL' || c.provider === provider));

  // 1. Department Allocation Data
  const getDeptData = () => {
    const deptMap: { [dept: string]: number } = {};
    filteredCosts.forEach(c => {
      deptMap[c.department] = (deptMap[c.department] || 0) + c.amount;
    });
    return Object.entries(deptMap).map(([name, value]) => ({
      name,
      value: Math.round(value * (metricType === 'unblended' ? 0.95 : 1.0)) // Mock variance for unblended
    }));
  };

  // 2. Trend Data by Service
  const getServiceTrendData = () => {
    const serviceTrend: { [date: string]: any } = {};
    
    // Sort dates
    const sortedCosts = [...filteredCosts].sort((a, b) => a.date.localeCompare(b.date));
    const uniqueDates = Array.from(new Set(sortedCosts.map(c => c.date))).slice(-8);

    uniqueDates.forEach(date => {
      serviceTrend[date] = { date };
    });

    filteredCosts.forEach(c => {
      if (serviceTrend[c.date]) {
        serviceTrend[c.date][c.service] = (serviceTrend[c.date][c.service] || 0) + Math.round(c.amount);
      }
    });

    return Object.values(serviceTrend);
  };

  // 3. Tabular aggregate by service/department
  const getSummaryTable = () => {
    const keyMap: { [key: string]: { service: string; provider: string; department: string; amount: number } } = {};

    filteredCosts.forEach(c => {
      const key = `${c.provider}-${c.service}-${c.department}`;
      if (!keyMap[key]) {
        keyMap[key] = { service: c.service, provider: c.provider, department: c.department, amount: 0 };
      }
      keyMap[key].amount += c.amount;
    });

    return Object.values(keyMap).sort((a, b) => b.amount - a.amount);
  };

  const deptData = getDeptData();
  const trendData = getServiceTrendData();
  const tableData = getSummaryTable();

  // Color mapping
  const colors = {
    AWS: '#00f2fe',
    GCP: '#8a2be2',
    Azure: '#ff007f',
    Engineering: '#00f2fe',
    'Data Science': '#8a2be2',
    Operations: '#ff007f',
    Finance: '#10b981'
  };

  const activeServices = Array.from(new Set(filteredCosts.map(c => c.service))).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Cost Analytics Engine</h2>
          <p className="text-gray-400 text-sm mt-1">Deep-dive cost categorization, business unit mapping, and multi-cloud metrics.</p>
        </div>
      </div>

      {/* Controls Bar */}
      <GlassCard hover={false} className="flex flex-wrap justify-between items-center gap-4 py-4 px-6">
        <div className="flex gap-2 bg-obsidian-950 p-1 rounded-xl border border-white/5">
          {['ALL', 'AWS', 'GCP', 'Azure'].map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                provider === p
                  ? 'bg-brand-teal text-obsidian-950 shadow-glass-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p === 'ALL' ? 'Multi-Cloud' : p}
            </button>
          ))}
        </div>

        <div className="flex gap-2 bg-obsidian-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setMetricType('amortized')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              metricType === 'amortized'
                ? 'bg-brand-purple text-white shadow-glass'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Amortized
          </button>
          <button
            onClick={() => setMetricType('unblended')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              metricType === 'unblended'
                ? 'bg-brand-purple text-white shadow-glass'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Unblended
          </button>
        </div>
      </GlassCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Allocation */}
        <GlassCard className="min-h-[350px] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-teal" /> Department Spend Allocation
            </h4>
            <p className="text-xs text-gray-400 mb-6">Cloud cost distribution allocated by business unit departments.</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {deptData.map((entry, index) => {
                    const color = colors[entry.name as keyof typeof colors] || '#00f2fe';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Stacked Service Trends */}
        <GlassCard className="min-h-[350px] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-purple" /> Service Stack Trend
            </h4>
            <p className="text-xs text-gray-400 mb-6">Daily aggregate analysis stacked by major resource product categories.</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                {activeServices.map((service, index) => {
                  const colorsList = ['#00f2fe', '#8a2be2', '#ff007f', '#10b981'];
                  return (
                    <Line
                      key={service}
                      type="monotone"
                      dataKey={service}
                      stroke={colorsList[index % colorsList.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Tabular Cost Allocations */}
      <GlassCard className="overflow-hidden">
        <div className="mb-4">
          <h4 className="text-base font-bold text-white mb-1">Cost Allocation Audit Table</h4>
          <p className="text-xs text-gray-400">Detailed granular mapping of active services, provider accounts, and department ownerships.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-obsidian-950 text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-4 px-6">Provider</th>
                <th className="py-4 px-6">Service Line</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6 text-right">Aggregate Spend</th>
                <th className="py-4 px-6 text-right">Actionable Saving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableData.map((row, idx) => {
                const saving = Math.round(row.amount * 0.15); // Mock 15% rightsizing saving
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                        row.provider === 'AWS' ? 'bg-[#00f2fe]' : row.provider === 'GCP' ? 'bg-[#8a2be2]' : 'bg-[#ff007f]'
                      }`} />
                      {row.provider}
                    </td>
                    <td className="py-4 px-6 text-gray-200">{row.service}</td>
                    <td className="py-4 px-6">{row.department}</td>
                    <td className="py-4 px-6 text-right text-white font-mono font-bold">${Math.round(row.amount).toLocaleString()}</td>
                    <td className="py-4 px-6 text-right text-brand-green font-mono font-semibold">${saving.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default CostAnalytics;
