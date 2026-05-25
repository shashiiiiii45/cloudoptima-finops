export interface CostMetric {
  service: string;
  provider: string;
  department: string;
  amount: number;
  date: string;
  isForecast: boolean;
}

export interface CloudResource {
  resource_id: string;
  name: string;
  type: string;
  region: string;
  status: string;
  cost_per_hour: number;
  cpu_utilization: number;
  memory_utilization: number;
  is_idle: boolean;
}

export interface Recommendation {
  id: number;
  resource_id: string;
  service: string;
  type: string;
  description: string;
  estimated_savings: number;
  confidence: number;
  risk_level: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Applied' | 'Dismissed';
}

export interface SystemAlert {
  id: number;
  type: string;
  severity: 'Info' | 'Warning' | 'Critical';
  message: string;
  value?: number;
  threshold?: number;
  is_resolved: boolean;
  created_at: string;
}
