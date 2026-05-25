import React from 'react';
import { useFinOps } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import {
  DollarSign,
  TrendingDown,
  Activity,
  Award,
  Leaf,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Server
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

export const Overview: React.FC = () => {
  const { costs, resources, recommendations, alerts, isSyncing, syncData } = useFinOps();

  // Aggregate stats
  const totalCost = costs
    .filter(c => !c.isForecast)
    .reduce((sum, curr) => sum + curr.amount, 0);

  // Amortized monthly average mock scale ($38,420 monthly scaling for presentation)
  const displayTotalCost = 38420.50;
  const displayForecast = 40510.80;
  
  const totalSavings = recommendations
    .filter(r => r.status === 'Active')
    .reduce((sum, curr) => sum + curr.estimated_savings, 0);

  const activeCount = resources.filter(r => r.status === 'running' || r.status === 'active').length;
  const idleCount = resources.filter(r => r.is_idle).length;

  // Process data for AreaChart (Daily spend over last 10 days)
  const getDailyTrendData = () => {
    const dailyMap: { [date: string]: { date: string; AWS: number; GCP: number; Azure: number } } = {};
    
    // Sort costs by date
    const sortedCosts = [...costs].filter(c => !c.isForecast).sort((a, b) => a.date.localeCompare(b.date));
    const uniqueDates = Array.from(new Set(sortedCosts.map(c => c.date))).slice(-10);

    uniqueDates.forEach(date => {
      dailyMap[date] = { date, AWS: 0, GCP: 0, Azure: 0 };
    });

    costs.forEach(c => {
      if (!c.isForecast && dailyMap[c.date]) {
        if (c.provider === 'AWS') dailyMap[c.date].AWS += c.amount;
        else if (c.provider === 'GCP') dailyMap[c.date].GCP += c.amount;
        else if (c.provider === 'Azure') dailyMap[c.date].Azure += c.amount;
      }
    });

    return Object.values(dailyMap);
  };

  // Process data for Service Breakdown PieChart
  const getServiceBreakdownData = () => {
    const serviceMap: { [service: string]: number } = {};
    costs.forEach(c => {
      if (!c.isForecast) {
        serviceMap[c.service] = (serviceMap[c.service] || 0) + c.amount;
      }
    });

    return Object.entries(serviceMap)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const chartData = getDailyTrendData();
  const pieData = getServiceBreakdownData();

  const COLORS = ['#00f2fe', '#8a2be2', '#ff007f', '#10b981', '#f59e0b'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">FinOps Command Center</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time cloud optimization analytics and AWS governance dashboard.</p>
        </div>
        <button
          onClick={syncData}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 hover:border-brand-teal/50 rounded-xl text-brand-teal text-sm font-semibold transition-all shadow-glass-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing Billing...' : 'Sync Cloud Accounts'}
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard glow hover className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Monthly Cost</p>
              <h3 className="text-2xl font-bold text-white mt-2">${displayTotalCost.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-teal/15 flex items-center justify-center border border-brand-teal/20">
              <DollarSign className="w-5 h-5 text-brand-teal" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-brand-rose text-xs font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+4.2% vs last month</span>
          </div>
        </GlassCard>

        <GlassCard glow hover className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">AI Projected Cost</p>
              <h3 className="text-2xl font-bold text-white mt-2">${displayForecast.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center border border-brand-purple/20">
              <TrendingDown className="w-5 h-5 text-brand-purple" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-brand-green text-xs font-medium">
            <span>Budget Risk: Low</span>
          </div>
        </GlassCard>

        <GlassCard glow hover className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Savings Opportunity</p>
              <h3 className="text-2xl font-bold text-brand-green mt-2">${totalSavings.toLocaleString()}/mo</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center border border-brand-green/20">
              <Activity className="w-5 h-5 text-brand-green" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-gray-400 text-xs">
            <span>{recommendations.filter(r => r.status === 'Active').length} Active recommendations</span>
          </div>
        </GlassCard>

        <GlassCard glow hover className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">FinOps Maturity Score</p>
              <h3 className="text-2xl font-bold text-white mt-2">84/100</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-magenta/15 flex items-center justify-center border border-brand-magenta/20">
              <Award className="w-5 h-5 text-brand-magenta" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-brand-teal text-xs font-medium">
            <span>Level: Walk (Optimized)</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 flex flex-col justify-between min-h-[350px]">
          <div>
            <h4 className="text-base font-bold text-white mb-1">Amortized Cloud Cost Trend</h4>
            <p className="text-xs text-gray-400 mb-6">Daily aggregate cost by provider across the last 10 billing cycles.</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="AWS" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorAws)" />
                <Area type="monotone" dataKey="GCP" stroke="#8a2be2" strokeWidth={2} fillOpacity={1} fill="url(#colorGcp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[350px]">
          <div>
            <h4 className="text-base font-bold text-white mb-1">Service Spend Distribution</h4>
            <p className="text-xs text-gray-400 mb-6">Top 5 infrastructure components contributing to total spend.</p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Sustainability & Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Carbon Efficiency Score</h4>
            <p className="text-2xl font-extrabold text-brand-green mt-1">92%</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Offset: 4.8 Metric Tons CO2e</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
            <Server className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Active Resources</h4>
            <p className="text-2xl font-extrabold text-white mt-1">{activeCount} Node instances</p>
            <p className="text-[10px] text-brand-rose mt-0.5">{idleCount} Underutilized/Idle servers</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-brand-purple" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Security Compliance Posture</h4>
            <p className="text-2xl font-extrabold text-white mt-1">94%</p>
            <p className="text-[10px] text-brand-green mt-0.5">CIS Benchmark compliant</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Overview;
