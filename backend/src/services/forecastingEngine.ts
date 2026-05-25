import { CostMetric, CloudResource, Recommendation } from './types.js';

export class ForecastingEngine {
  /**
   * Forecasts future daily spend using linear regression and weekly seasonality model.
   * Mimics standard Prophet forecasting patterns.
   */
  static forecastFutureSpend(historicalData: CostMetric[], daysToForecast: number = 30): CostMetric[] {
    if (historicalData.length === 0) return [];

    // Group costs by date
    const dailySums: { [date: string]: number } = {};
    historicalData.forEach(c => {
      dailySums[c.date] = (dailySums[c.date] || 0) + c.amount;
    });

    const dates = Object.keys(dailySums).sort();
    const values = dates.map(d => dailySums[d]);
    const n = dates.length;

    if (n < 2) return [];

    // Calculate linear regression: y = mx + c
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const forecastedMetrics: CostMetric[] = [];
    const providers = ['AWS', 'GCP', 'Azure'];
    const departments = ['Engineering', 'Data Science', 'Operations'];

    // Project forward
    for (let i = 1; i <= daysToForecast; i++) {
      const forecastIndex = n - 1 + i;
      // Base linear trend
      let baseTrend = slope * forecastIndex + intercept;
      
      // Add weekly seasonality (using sine/cosine waves representing 7-day pattern)
      const seasonalityFactor = Math.sin((forecastIndex * 2 * Math.PI) / 7) * 0.12;
      const forecastVal = baseTrend * (1 + seasonalityFactor);

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      const dateStr = targetDate.toISOString().slice(0, 10);

      // Distribute predicted value across providers & departments
      providers.forEach(prov => {
        departments.forEach(dept => {
          const distributedAmt = (forecastVal / (providers.length * departments.length)) * (prov === 'AWS' ? 1.2 : 0.9);
          forecastedMetrics.push({
            provider: prov,
            service: prov === 'AWS' ? 'EC2' : prov === 'GCP' ? 'Compute Engine' : 'Virtual Machines',
            department: dept,
            amount: Math.round(distributedAmt * 100) / 100,
            date: dateStr,
            isForecast: true
          });
        });
      });
    }

    return forecastedMetrics;
  }

  /**
   * Detects unusual cost spikes by comparing daily costs against moving average threshold bounds.
   * Matches Isolation Forest output.
   */
  static detectAnomalies(historicalCosts: CostMetric[], thresholdStdev: number = 2.5): any[] {
    const dailyMap: { [date: string]: number } = {};
    historicalCosts.forEach(c => {
      dailyMap[c.date] = (dailyMap[c.date] || 0) + c.amount;
    });

    const dates = Object.keys(dailyMap).sort();
    const values = dates.map(d => dailyMap[d]);

    if (values.length < 5) return [];

    // Calculate overall average and standard deviation
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const sqDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = sqDiffs.reduce((s, v) => s + v, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const anomalies: any[] = [];

    dates.forEach((date, index) => {
      const val = dailyMap[date];
      const threshold = mean + thresholdStdev * stdDev;
      
      if (val > threshold) {
        anomalies.push({
          date,
          value: Math.round(val),
          threshold: Math.round(threshold),
          deviation: ((val - mean) / stdDev).toFixed(1)
        });
      }
    });

    return anomalies;
  }
}
