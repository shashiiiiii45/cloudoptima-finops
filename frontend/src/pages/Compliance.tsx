import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, ShieldAlert, Award, ChevronDown, Check, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Compliance: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, title: 'Enforce MFA on Console Logins', desc: 'Verify that Multi-Factor Authentication is active for all root and administrator IAM users.', category: 'IAM Security', score: 15, status: 'Failed', severity: 'Critical', remediation: 'Open AWS Console -> IAM Dashboard -> User Security Credentials -> Enable MFA.' },
    { id: 2, title: 'Restrict Public S3 Buckets access', desc: 'Ensure that all active financial statement bucket repositories block public read/write permissions.', category: 'Storage Governance', score: 20, status: 'Passed', severity: 'High', remediation: 'Enable Block Public Access setting on S3 bucket permissions.' },
    { id: 3, title: 'Enable AWS CloudTrail in all regions', desc: 'Audit logs should be enabled continuously across AWS regions to record operations requests.', category: 'Audit Trails', score: 10, status: 'Passed', severity: 'Medium', remediation: 'Create trail in AWS CloudTrail console and configure S3 storage.' },
    { id: 4, title: 'Rotate Active Access Keys > 90 Days', desc: 'Check if any IAM developer access credentials have been active without rotation for over 3 months.', category: 'Credential Hygiene', score: 15, status: 'Failed', severity: 'High', remediation: 'Generate new Access Key, deploy key, delete old Access Key.' },
    { id: 5, title: 'Configure KMS Key Encryption on EBS Volumes', desc: 'EC2 EBS storage volumes must be encrypted with Customer Managed Keys to meet PCI-DSS standards.', category: 'Encryption', score: 10, status: 'Failed', severity: 'Medium', remediation: 'Enable default EBS Encryption in AWS EC2 regional settings.' },
  ]);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const calculateScore = () => {
    const maxScore = items.reduce((sum, curr) => sum + curr.score, 0);
    const passedScore = items
      .filter(item => item.status === 'Passed')
      .reduce((sum, curr) => sum + curr.score, 0);

    return Math.round((passedScore / maxScore) * 100);
  };

  const handleRemediate = (id: number) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Passed' } : item))
    );
    alert("Remediation Pipeline Triggered: Configured AWS Config auto-remediation rule via Lambda function.");
  };

  const score = calculateScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Security & Governance Compliance</h2>
        <p className="text-gray-400 text-sm mt-1">AWS security posture auditing, IAM risk controls, and automated compliance checklist.</p>
      </div>

      {/* Score Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glow className="col-span-1 md:col-span-2 flex items-center justify-between border-brand-teal/20">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-teal" /> Cloud Posture Score
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your compliance rating across CIS Benchmarks, SOC2 security controls, and HIPAA financial governance standards.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#00f2fe"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-xl font-extrabold text-white">{score}%</span>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Compliance Standard</h4>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white rounded font-bold">CIS AWS v1.4</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white rounded font-bold">SOC2 Type II</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white rounded font-bold">PCI-DSS</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 mt-4">
            Audited 10 minutes ago via CloudTrail telemetry scanner.
          </div>
        </GlassCard>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white">Compliance Control Checks</h4>
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const isFailed = item.status === 'Failed';
            return (
              <GlassCard key={item.id} hover={false} className="p-4 border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {isFailed ? (
                      <ShieldAlert className="w-5 h-5 text-brand-rose shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        {item.title}
                        {isFailed && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-brand-rose/10 text-brand-rose border border-brand-rose/25 font-bold uppercase font-sans">
                            {item.severity}
                          </span>
                        )}
                      </h5>
                      <p className="text-xs text-gray-400 mt-1 leading-normal font-sans">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">{item.category}</span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-white/5 space-y-4"
                    >
                      <div className="p-3 bg-obsidian-950/80 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider block">Recommended Action</span>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.remediation}</p>
                      </div>

                      {isFailed ? (
                        <button
                          onClick={() => handleRemediate(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal hover:bg-brand-teal/85 text-obsidian-950 font-bold text-xs rounded-lg transition-colors shadow-glass-glow"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Auto-Remediate
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-brand-green font-bold">
                          <Check className="w-4 h-4" /> Control check passed
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Compliance;
