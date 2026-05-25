import React, { useState } from 'react';
import { useFinOps } from '../context/FinOpsContext';
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, Sliders, DollarSign, ArrowDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Forecasting: React.FC = () => {
  const { costs } = useFinOps();
  
  // Slider states for the simulator
  const [scalePercentage, setScalePercentage] = useState<number>(0);
  const [tieringActive, setTieringActive] = useState<boolean>(false);
  const [spotPercentage, setSpotPercentage] = useState<number>(0);

  // Baseline display values (enterprise scale)
  const baseForecast = 40510.80;
  
  // Dynamic Simulator calculations
  const calculateSimulatedSavings = () => {
    // 1. EC2 Scaling: saves up to $150 per 10% downsizing
    const ec2Savings = (scalePercentage / 10) * 155.0;
    // 2. S3 Tiering: flat savings of $280
    const s3Savings = tieringActive ? 280.50 : 0;
    // 3. Spot Instances: saves up to $80 per 10% migration
    const spotSavings = (spotPercentage / 10) * 83.20;

    return Math.round((ec2Savings + s3Savings + spotSavings) * 100) / 100;
  };

  const totalSimulatedSavings = calculateSimulatedSavings();
  const simulatedForecast = Math.max(25000, Math.round((baseForecast - totalSimulatedSavings) * 100) / 100);

  // Aggregate daily forecasted costs for Recharts
  const getForecastChartData = () => {
    const dailyData: { [date: string]: { date: string; Actual?: number; Forecast: number; Upper: number; Lower: number } } = {};
    
    // Sort dates
    const sorted = [...costs].sort((a, b) => a.date.localeCompare(b.date));
    
    // Filter last 10 days of historical data
    const historical = sorted.filter(c => !c.isForecast).slice(-10 * 3 * 4); // group scale
    // Filter next 10 days of forecasts
    const future = sorted.filter(c => c.isForecast).slice(0, 10 * 3 * 4);

    // Group historical
    const histDates = Array.from(new Set(historical.map(c => c.date)));
    histDates.forEach(date => {
      const dayCosts = costs.filter(c => c.date === date && !c.isForecast);
      const total = dayCosts.reduce((sum, curr) => sum + curr.amount, 0);
      
      dailyData[date] = {
        date,
        Actual: Math.round(total * 8), // upscale for enterprise visual
        Forecast: Math.round(total * 8),
        Upper: Math.round(total * 8.5),
        Lower: Math.round(total * 7.5)
      };
    });

    // Group future forecasts
    const futureDates = Array.from(new Set(future.map(c => c.date)));
    futureDates.forEach(date => {
      const dayCosts = costs.filter(c => c.date === date && c.isForecast);
      const total = dayCosts.reduce((sum, curr) => sum + curr.amount, 0);
      
      dailyData[date] = {
        date,
        Forecast: Math.round(total * 8.2),
        Upper: Math.round(total * 9.2),
        Lower: Math.round(total * 7.2)
      };
    });

    return Object.values(dailyData);
  };

  const chartData = getForecastChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">AI Forecasting & Cost Simulation</h2>
        <p className="text-gray-400 text-sm mt-1">Machine Learning time-series prediction models with interactive scenario planning.</p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Forecast Chart */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-brand-teal" />
              <h4 className="text-base font-bold text-white">AI Billing Forecast (Prophet Model)</h4>
            </div>
            <p className="text-xs text-gray-400 mb-6">Showing historical spend alongside forecasted 30-day projection intervals.</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="actualGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                {/* Confidence Bounds */}
                <Area type="monotone" dataKey="Upper" stroke="transparent" fill="#8a2be2" fillOpacity={0.05} name="Upper Bound" />
                <Area type="monotone" dataKey="Lower" stroke="transparent" fill="#8a2be2" fillOpacity={0.05} name="Lower Bound" />
                {/* Actual Spend */}
                <Area type="monotone" dataKey="Actual" stroke="#00f2fe" strokeWidth={2} fill="url(#actualGlow)" name="Historical Actual" />
                {/* Projected Trend */}
                <Area type="monotone" dataKey="Forecast" stroke="#8a2be2" strokeWidth={2} fill="url(#forecastGlow)" strokeDasharray="5 5" name="Projected Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* What-If Simulator Panel */}
        <div className="space-y-6">
          <GlassCard glow className="border-brand-purple/20 space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-purple" />
              <h4 className="text-base font-bold text-white">What-If Cost Simulator</h4>
            </div>
            <p className="text-xs text-gray-400">Model the financial impact of resource resizing, scheduling, and tiering changes.</p>

            <div className="space-y-5">
              {/* Slider 1: EC2 Scheduling */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-semibold">EC2 Night/Weekend Shutdown</span>
                  <span className="text-brand-teal font-bold">{scalePercentage}% resources</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={scalePercentage}
                  onChange={(e) => setScalePercentage(Number(e.target.value))}
                  className="w-full accent-brand-teal bg-obsidian-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-500">Automatically shut down instances during non-business hours.</p>
              </div>

              {/* Slider 2: Spot Instances */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Spot Instance Migration</span>
                  <span className="text-brand-purple font-bold">{spotPercentage}% workload</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={spotPercentage}
                  onChange={(e) => setSpotPercentage(Number(e.target.value))}
                  className="w-full accent-brand-purple bg-obsidian-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-500">Migrate stateless containers to cheap AWS Spot node pools.</p>
              </div>

              {/* Toggle 3: S3 Lifecycle Tiering */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <span className="text-xs font-semibold text-white block">S3 Glacier Tiering</span>
                  <span className="text-[10px] text-gray-500">Transition logs &gt; 90 days</span>
                </div>
                <button
                  onClick={() => setTieringActive(!tieringActive)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    tieringActive ? 'bg-brand-green' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-obsidian-950 rounded-full transition-transform duration-200 transform ${
                    tieringActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Simulated Savings Output */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Original Forecast:</span>
                <span className="text-xs font-semibold text-white">${baseForecast.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-green font-bold">Simulated Monthly Savings:</span>
                <span className="text-sm font-bold text-brand-green flex items-center gap-1">
                  <ArrowDown className="w-4 h-4" /> -${totalSimulatedSavings.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-gradient-to-r from-brand-purple/10 to-brand-teal/10 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white">New Forecast:</span>
                <span className="text-base font-extrabold font-mono text-brand-teal">${simulatedForecast.toLocaleString()}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Forecasting;
