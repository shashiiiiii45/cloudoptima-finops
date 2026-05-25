import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { FileText, Download, TrendingUp, DollarSign, Leaf, RefreshCw, BarChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export const Reports: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const reportTypes = [
    { id: 'exec', name: 'Executive Cost Summary', desc: 'High-level multi-cloud cost trends and budget risk analysis for finance officers.', format: 'PDF', size: '2.4 MB' },
    { id: 'waste', name: 'Cloud Waste & Idle Resource Audit', desc: 'Granular log of idle EC2/RDS databases, S3 lifecycle gaps, and EKS sizing waste.', format: 'CSV', size: '840 KB' },
    { id: 'k8s', name: 'Kubernetes Pod Efficiency Report', desc: 'EKS cluster allocation logs comparing limits, requests, and actual node performance.', format: 'PDF', size: '3.1 MB' },
    { id: 'carbon', name: 'Green Cloud Sustainability Audit', desc: 'Carbon output metric logs and green energy offset scorecard for ESG compliance.', format: 'PDF', size: '1.8 MB' },
  ];

  // ROI projection data (FinOps cost vs savings generated)
  const roiData = [
    { month: 'Jan', Savings: 1200, ToolCost: 350 },
    { month: 'Feb', Savings: 2800, ToolCost: 350 },
    { month: 'Mar', Savings: 4200, ToolCost: 350 },
    { month: 'Apr', Savings: 6800, ToolCost: 350 },
    { month: 'May', Savings: 9400, ToolCost: 350 },
  ];

  const handleDownload = (id: string, name: string) => {
    setIsGenerating(id);
    setTimeout(() => {
      setIsGenerating(null);
      alert(`Report Downloaded: "${name}" has been compiled and saved to your local downloads directory.`);
    }, 1200);
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
        <h2 className="text-3xl font-bold text-white tracking-tight">FinOps Reports & Sustainability</h2>
        <p className="text-gray-400 text-sm mt-1">Exportable cost optimization reports and Green Cloud carbon telemetry audits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-teal" /> Available Reports
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <GlassCard key={report.id} className="flex flex-col justify-between h-48 border-white/5 hover:border-brand-teal/20">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-brand-teal rounded font-bold">{report.format}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{report.size}</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{report.name}</h5>
                  <p className="text-xs text-gray-400 leading-normal">{report.desc}</p>
                </div>
                <button
                  onClick={() => handleDownload(report.id, report.name)}
                  disabled={isGenerating !== null}
                  className="w-full mt-4 py-2 bg-white/5 hover:bg-brand-teal/10 hover:text-brand-teal border border-white/10 hover:border-brand-teal/20 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating === report.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Compiling PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download Report
                    </>
                  )}
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ROI and Sustainability summary */}
        <div className="space-y-6">
          {/* ROI Chart */}
          <GlassCard glow className="border-brand-purple/20 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-purple" />
              <h4 className="text-sm font-bold text-white">FinOps Tooling ROI</h4>
            </div>
            <p className="text-xs text-gray-400">Monthly breakdown comparing savings generated against CloudOptima SaaS license costs.</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={roiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0f19',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="Savings" fill="#10b981" radius={[3, 3, 0, 0]} name="Savings ($)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Sustainability tracker */}
          <GlassCard glow className="border-brand-green/20 space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-brand-green" />
              <h4 className="text-sm font-bold text-white">ESG Green Cloud Stats</h4>
            </div>
            <p className="text-xs text-gray-400">Carbon footprints offset by using AWS server-less and optimized Graviton processors.</p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Carbon Emissions</span>
                <span className="text-white font-mono font-bold">12.4 Metric Tons CO2e</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Green Energy Factor</span>
                <span className="text-brand-green font-mono font-bold">94.2%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Compute Efficiency</span>
                <span className="text-brand-teal font-mono font-bold">96.8 Score</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
