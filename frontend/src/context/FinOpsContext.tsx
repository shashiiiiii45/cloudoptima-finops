import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions
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

interface User {
  email: string;
  role: string;
  token?: string;
}

interface FinOpsContextType {
  user: User | null;
  activePage: string;
  setActivePage: (page: string) => void;
  costs: CostMetric[];
  resources: CloudResource[];
  recommendations: Recommendation[];
  alerts: SystemAlert[];
  isSyncing: boolean;
  syncData: () => Promise<void>;
  login: (email: string, role: string) => Promise<boolean>;
  logout: () => void;
  applyRecommendation: (id: number) => Promise<void>;
  dismissRecommendation: (id: number) => Promise<void>;
}

const FinOpsContext = createContext<FinOpsContextType | undefined>(undefined);

export const FinOpsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ email: 'admin@cloudoptima.com', role: 'Admin' });
  const [activePage, setActivePage] = useState<string>('overview');
  const [costs, setCosts] = useState<CostMetric[]>([]);
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Generate highly realistic mock data for immediate UI rendering
  const generateMockData = () => {
    // Generate 30 days of billing data
    const services = ['EC2', 'RDS', 'S3', 'Lambda', 'EKS', 'DynamoDB', 'CloudWatch'];
    const departments = ['Engineering', 'Data Science', 'Operations', 'Finance'];
    const providers = ['AWS', 'GCP', 'Azure'];
    const mockCosts: CostMetric[] = [];

    // Historical 30 days
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);

      providers.forEach(prov => {
        services.forEach((service, sIdx) => {
          // Adjust service availability based on provider
          let sName = service;
          if (prov === 'GCP') {
            if (service === 'EC2') sName = 'Compute Engine';
            else if (service === 'S3') sName = 'Cloud Storage';
            else if (service === 'RDS') sName = 'Cloud SQL';
            else if (service === 'EKS') sName = 'GKE';
            else return; // Skip others for simplicity
          } else if (prov === 'Azure') {
            if (service === 'EC2') sName = 'Virtual Machines';
            else if (service === 'S3') sName = 'Blob Storage';
            else if (service === 'RDS') sName = 'SQL Database';
            else if (service === 'EKS') sName = 'AKS';
            else return; // Skip others
          }

          departments.forEach((dept, dIdx) => {
            // Seed a daily value with some fluctuations and weekly seasonality
            const base = (sIdx + 1) * 35 + (dIdx + 1) * 15;
            const fluctuation = Math.sin(i + sIdx) * 12 + Math.cos(i * 0.5) * 8;
            // Weekly drop on weekends (i % 7 represents day of week)
            const weekendFactor = (i % 7 === 0 || i % 7 === 1) ? 0.75 : 1.0;
            // Add a spike on May 12th
            const spikeFactor = (dateStr === '2026-05-12' && sName === 'EC2') ? 1.45 : 1.0;

            mockCosts.push({
              provider: prov,
              service: sName,
              department: dept,
              amount: Math.max(5, Math.round((base + fluctuation) * weekendFactor * spikeFactor * 100) / 100),
              date: dateStr,
              isForecast: false
            });
          });
        });
      });
    }

    // Forecast next 30 days
    for (let i = 0; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().slice(0, 10);

      providers.forEach(prov => {
        services.forEach((service, sIdx) => {
          let sName = service;
          if (prov === 'GCP') {
            if (service === 'EC2') sName = 'Compute Engine';
            else if (service === 'S3') sName = 'Cloud Storage';
            else if (service === 'RDS') sName = 'Cloud SQL';
            else if (service === 'EKS') sName = 'GKE';
            else return;
          } else if (prov === 'Azure') {
            if (service === 'EC2') sName = 'Virtual Machines';
            else if (service === 'S3') sName = 'Blob Storage';
            else if (service === 'RDS') sName = 'SQL Database';
            else if (service === 'EKS') sName = 'AKS';
            else return;
          }

          departments.forEach((dept, dIdx) => {
            const base = (sIdx + 1) * 37 + (dIdx + 1) * 17; // Growth trend
            const fluctuation = Math.sin(i + sIdx) * 10;
            mockCosts.push({
              provider: prov,
              service: sName,
              department: dept,
              amount: Math.max(5, Math.round((base + fluctuation) * 100) / 100),
              date: dateStr,
              isForecast: true
            });
          });
        });
      });
    }

    // Mock active resources
    const mockResources: CloudResource[] = [
      { resource_id: 'i-09f1a23b4c5d6e7f8', name: 'prod-auth-service', type: 'ec2', region: 'us-east-1', status: 'running', cost_per_hour: 0.192, cpu_utilization: 4.2, memory_utilization: 12.5, is_idle: true },
      { resource_id: 'i-08a9b8c7d6e5f4g3h', name: 'prod-payment-gateway', type: 'ec2', region: 'us-east-1', status: 'running', cost_per_hour: 0.384, cpu_utilization: 68.4, memory_utilization: 72.1, is_idle: false },
      { resource_id: 'i-072a3b4c5d6e7f8g9', name: 'dev-sandbox-node', type: 'ec2', region: 'us-west-2', status: 'running', cost_per_hour: 0.096, cpu_utilization: 1.5, memory_utilization: 8.2, is_idle: true },
      { resource_id: 'db-rds-postgresql-primary', name: 'prod-core-db', type: 'rds', region: 'us-east-1', status: 'running', cost_per_hour: 0.70, cpu_utilization: 32.5, memory_utilization: 85.0, is_idle: false },
      { resource_id: 'db-rds-postgresql-replica', name: 'dev-read-replica', type: 'rds', region: 'us-east-1', status: 'running', cost_per_hour: 0.35, cpu_utilization: 1.2, memory_utilization: 8.4, is_idle: true },
      { resource_id: 's3-bucket-financial-logs-archive', name: 'finance-logs-archive', type: 's3', region: 'us-east-1', status: 'active', cost_per_hour: 0.023, cpu_utilization: 0, memory_utilization: 0, is_idle: false },
      { resource_id: 's3-bucket-static-assets', name: 'client-portal-static', type: 's3', region: 'us-west-2', status: 'active', cost_per_hour: 0.005, cpu_utilization: 0, memory_utilization: 0, is_idle: false },
      { resource_id: 'lambda-pdf-generator', name: 'pdf-statement-gen', type: 'lambda', region: 'us-east-1', status: 'active', cost_per_hour: 0.0001, cpu_utilization: 12.0, memory_utilization: 0, is_idle: false },
      { resource_id: 'eks-prod-billing-cluster', name: 'prod-kubernetes-cluster', type: 'eks', region: 'us-east-1', status: 'running', cost_per_hour: 0.20, cpu_utilization: 45.8, memory_utilization: 58.9, is_idle: false },
    ];

    // Mock recommendations
    const mockRecommendations: Recommendation[] = [
      { id: 1, resource_id: 'i-09f1a23b4c5d6e7f8', service: 'EC2', type: 'Stop Idle', description: 'Stop idle EC2 instance prod-auth-service (i-09f1a23b4c5d6e7f8) showing average CPU < 5% over 14 days.', estimated_savings: 138.24, confidence: 98.0, risk_level: 'Low', complexity: 'Low', status: 'Active' },
      { id: 2, resource_id: 'db-rds-postgresql-replica', service: 'RDS', type: 'Rightsize', description: 'Downsize dev-read-replica from db.m5.large to db.t3.medium. Current CPU utilization is under 2%.', estimated_savings: 126.0, confidence: 92.5, risk_level: 'Low', complexity: 'Medium', status: 'Active' },
      { id: 3, resource_id: 's3-bucket-financial-logs-archive', service: 'S3', type: 'S3 Tiering', description: 'Move standard storage objects in finance-logs-archive bucket to Glacier Deep Archive for objects older than 90 days.', estimated_savings: 280.50, confidence: 95.0, risk_level: 'Low', complexity: 'Low', status: 'Active' },
      { id: 4, resource_id: 'i-08a9b8c7d6e5f4g3h', service: 'EC2', type: 'Spot Instance', description: 'Migrate stateless transaction node in payment-gateway scaling group to Spot Instances.', estimated_savings: 166.40, confidence: 80.0, risk_level: 'Medium', complexity: 'High', status: 'Active' },
    ];

    // Mock alerts
    const mockAlerts: SystemAlert[] = [
      { id: 1, type: 'CostAnomaly', severity: 'Critical', message: 'Billing spike detected in AWS EC2 Engineering on 2026-05-12. Spend increased by 45% ($520.40 vs 14-day average $365.00).', value: 520.40, threshold: 365.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 2, type: 'BudgetBreach', severity: 'Warning', message: 'AWS May Budget limit warning. Current forecasted spend is $15,840.00, which exceeds 75% of budget ($15,000.00).', value: 15840.00, threshold: 15000.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
      { id: 3, type: 'IdleResource', severity: 'Info', message: 'Underutilized RDS replica dev-read-replica running for 14 days with CPU < 2%. Consider downsizing.', value: 126.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
    ];

    setCosts(mockCosts);
    setResources(mockResources);
    setRecommendations(mockRecommendations);
    setAlerts(mockAlerts);
  };

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('http://localhost:3001/api/sync', {
        headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setCosts(data.costs || []);
        setResources(data.resources || []);
        setRecommendations(data.recommendations || []);
        setAlerts(data.alerts || []);
      } else {
        // Run locally generated mock data if backend not reachable
        generateMockData();
      }
    } catch (e) {
      console.log('Skipping backend sync, running mock engine mode locally.');
      generateMockData();
    }
    // Simulate short network sync delay for realistic feel
    await new Promise(r => setTimeout(r, 600));
    setIsSyncing(false);
  };

  useEffect(() => {
    syncData();

    // Setup WebSockets for real-time updates
    let ws: WebSocket;
    const connectWS = () => {
      ws = new WebSocket('ws://localhost:3001/ws');
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'ALERT_ANOMALY') {
            setAlerts(prev => [message.payload, ...prev]);
          } else if (message.type === 'METRIC_TICK') {
            // Update CPU utilization of a random resource
            setResources(prev =>
              prev.map(r =>
                r.resource_id === message.payload.resource_id
                  ? { ...r, cpu_utilization: message.payload.cpu_utilization }
                  : r
              )
            );
          }
        } catch (err) {
          console.error('WS Error:', err);
        }
      };
      ws.onerror = () => {
        // Silently close and retry
      };
      ws.onclose = () => {
        setTimeout(connectWS, 10000); // Retry connection in 10s
      };
    };

    connectWS();
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const login = async (email: string, role: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'admin123' }) // Standard bypass password
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ email: data.email, role: data.role, token: data.token });
        return true;
      }
    } catch (e) {
      // Local login fallback
      setUser({ email, role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const applyRecommendation = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/recommendations/${id}/apply`, {
        method: 'POST',
        headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        setRecommendations(prev =>
          prev.map(rec => (rec.id === id ? { ...rec, status: 'Applied' } : rec))
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      // Apply locally
      setRecommendations(prev =>
        prev.map(rec => {
          if (rec.id === id) {
            // Find resource and update state to simulated scaled/stopped
            setResources(rPrev =>
              rPrev.map(res =>
                res.resource_id === rec.resource_id
                  ? { ...res, status: rec.type === 'Stop Idle' ? 'stopped' : res.status, cpu_utilization: 0, is_idle: false }
                  : res
              )
            );
            return { ...rec, status: 'Applied' };
          }
          return rec;
        })
      );
    }
  };

  const dismissRecommendation = async (id: number) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'Dismissed' } : rec))
    );
  };

  return (
    <FinOpsContext.Provider
      value={{
        user,
        activePage,
        setActivePage,
        costs,
        resources,
        recommendations,
        alerts,
        isSyncing,
        syncData,
        login,
        logout,
        applyRecommendation,
        dismissRecommendation
      }}
    >
      {children}
    </FinOpsContext.Provider>
  );
};

export const useFinOps = () => {
  const context = useContext(FinOpsContext);
  if (context === undefined) {
    throw new Error('useFinOps must be used within a FinOpsProvider');
  }
  return context;
};
