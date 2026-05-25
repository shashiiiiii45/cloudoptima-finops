import React, { useState } from 'react';
import { useFinOps, Recommendation } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { Server, Database, Layers, ArrowDownCircle, Check, Trash2, ShieldAlert, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Recommendations: React.FC = () => {
  const { recommendations, applyRecommendation, dismissRecommendation } = useFinOps();
  const [filter, setFilter] = useState<'Active' | 'Applied' | 'Dismissed'>('Active');

  const filtered = recommendations.filter(rec => rec.status === filter);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'EC2':
        return <Server className="w-5 h-5 text-brand-teal" />;
      case 'RDS':
        return <Database className="w-5 h-5 text-brand-purple" />;
      case 'S3':
      default:
        return <Layers className="w-5 h-5 text-brand-magenta" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-brand-green bg-brand-green/10 border border-brand-green/20';
      case 'Medium':
        return 'text-brand-amber bg-brand-amber/10 border border-brand-amber/20';
      case 'High':
      default:
        return 'text-brand-rose bg-brand-rose/10 border border-brand-rose/20';
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">FinOps Recommendations</h2>
          <p className="text-gray-400 text-sm mt-1">Algorithmic cost optimization suggestions prioritized by savings potential and safety score.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {(['Active', 'Applied', 'Dismissed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              filter === tab ? 'text-white bg-white/5 border border-white/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
            {tab === 'Active' && filtered.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center text-[10px] text-obsidian-950 font-bold font-mono">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                transition={{ duration: 0.2 }}
              >
                <GlassCard glow className="h-full flex flex-col justify-between border-white/5 hover:border-brand-teal/20">
                  <div className="space-y-4">
                    {/* Header: Service Type & Savings */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center">
                          {getServiceIcon(rec.service)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">{rec.service}</span>
                          <span className="text-[10px] text-gray-500 block font-mono">{rec.resource_id}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-brand-green font-semibold block uppercase">Est. Monthly Savings</span>
                        <span className="text-xl font-bold font-mono text-brand-green">${rec.estimated_savings.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 leading-relaxed font-sans">{rec.description}</p>

                    {/* Meta stats chips */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getRiskColor(rec.risk_level)}`}>
                        {rec.risk_level} Risk
                      </span>
                      <span className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-brand-teal" /> Confidence: {rec.confidence}%
                      </span>
                      <span className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-purple" /> Complexity: {rec.complexity}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {filter === 'Active' && (
                    <div className="flex gap-3 pt-6 mt-4 border-t border-white/5">
                      <button
                        onClick={() => applyRecommendation(rec.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-teal hover:bg-brand-teal/80 text-obsidian-950 font-bold text-xs rounded-xl transition-colors shadow-glass-glow"
                      >
                        <ArrowDownCircle className="w-4 h-4" />
                        Apply Action
                      </button>
                      <button
                        onClick={() => dismissRecommendation(rec.id)}
                        className="px-4 py-2.5 bg-white/5 hover:bg-brand-rose/10 hover:text-brand-rose border border-white/10 hover:border-brand-rose/25 rounded-xl text-gray-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {filter === 'Applied' && (
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-xs text-brand-green font-bold">
                      <Check className="w-4 h-4" />
                      Recommendation Applied Successfully
                    </div>
                  )}

                  {filter === 'Dismissed' && (
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-xs text-gray-500 font-bold">
                      Recommendation Dismissed
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-gray-500">
              No recommendations found in this status.
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Recommendations;
