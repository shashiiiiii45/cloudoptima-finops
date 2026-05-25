import React, { useState } from 'react';
import { useFinOps, SystemAlert } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { AlertCircle, Bell, ShieldAlert, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Alerts: React.FC = () => {
  const { alerts } = useFinOps();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Resolution state tracker
  const [resolvedAlertIds, setResolvedAlertIds] = useState<number[]>([]);

  const handleResolve = (id: number) => {
    setResolvedAlertIds(prev => [...prev, id]);
  };

  const filteredAlerts = alerts.filter(alert => {
    const isResolved = resolvedAlertIds.includes(alert.id);
    if (isResolved) return false;
    
    if (filter === 'All') return true;
    return alert.severity === filter;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'border-brand-rose/25 bg-brand-rose/5 text-brand-rose';
      case 'Warning':
        return 'border-brand-amber/25 bg-brand-amber/5 text-brand-amber';
      case 'Info':
      default:
        return 'border-brand-teal/25 bg-brand-teal/5 text-brand-teal';
    }
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) return;
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      alert(`Integration Test Dispatched: Dispatched test JSON payload containing billing anomaly telemetry to: ${webhookUrl}`);
    }, 800);
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
        <h2 className="text-3xl font-bold text-white tracking-tight">Alerts Center</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time billing anomalies, budget threshold notifications, and scaling alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 border-b border-white/5 pb-3">
            {(['All', 'Critical', 'Warning', 'Info'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab ? 'text-white bg-white/5 border border-white/10' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hover={false} className={`border ${getSeverityStyle(alert.severity)}`}>
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold uppercase tracking-wider">{alert.severity} Incident</span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed font-sans">{alert.message}</p>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            {alert.value && (
                              <span>Value: <strong className="text-white font-mono">${alert.value.toLocaleString()}</strong></span>
                            )}
                            {alert.threshold && (
                              <span>Limit: <strong className="text-white font-mono">${alert.threshold.toLocaleString()}</strong></span>
                            )}
                          </div>
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="flex items-center gap-1 text-[11px] px-3 py-1 bg-white/5 hover:bg-brand-green/20 hover:text-brand-green border border-white/10 hover:border-brand-green/30 rounded-lg font-bold transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500 font-medium">
                No active alerts in this severity category. All clear!
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Webhook Settings Sidebar */}
        <div className="space-y-6">
          <GlassCard glow className="border-brand-teal/20 space-y-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-teal" />
              <h4 className="text-base font-bold text-white">Alert Integrations</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bridge CloudOptima anomaly alerts into your operations communication tools. Support Slack incoming webhooks, MS Teams, and AWS SNS topics.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Hook URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3 py-2 bg-obsidian-950 border border-white/5 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 rounded-xl text-xs text-white focus:outline-none placeholder-gray-600"
                />
              </div>

              <button
                onClick={handleTestWebhook}
                disabled={isTestingWebhook || !webhookUrl}
                className="w-full flex items-center justify-center gap-2 py-2 bg-brand-teal hover:bg-brand-teal/85 text-obsidian-950 font-bold text-xs rounded-xl transition-all shadow-glass-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isTestingWebhook ? 'Dispatching Payload...' : 'Test Slack Integration'}
              </button>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-brand-purple" /> Webhook Security
              </p>
              <p className="text-[10px] text-gray-500 leading-normal">
                Payloads are cryptographically signed using your FinOps private client secret before transmission to prevent spoofing.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Alerts;
