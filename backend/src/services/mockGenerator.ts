// Mock Data Generator for CloudOptima backend
import { CostMetric, CloudResource, Recommendation, SystemAlert } from './types.js';

export class MockGenerator {
  static generateCosts(): CostMetric[] {
    const services = ['EC2', 'RDS', 'S3', 'Lambda', 'EKS', 'DynamoDB', 'CloudWatch'];
    const departments = ['Engineering', 'Data Science', 'Operations', 'Finance'];
    const providers = ['AWS', 'GCP', 'Azure'];
    const costs: CostMetric[] = [];

    // Historical 30 days
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
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
            const base = (sIdx + 1) * 35 + (dIdx + 1) * 15;
            const fluctuation = Math.sin(i + sIdx) * 12 + Math.cos(i * 0.5) * 8;
            const weekendFactor = (i % 7 === 0 || i % 7 === 1) ? 0.75 : 1.0;
            // Introduce a cost spike on May 12th
            const spikeFactor = (dateStr === '2026-05-12' && sName === 'EC2') ? 1.45 : 1.0;

            costs.push({
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

    // Forecast 30 days
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
            const base = (sIdx + 1) * 37 + (dIdx + 1) * 17;
            const fluctuation = Math.sin(i + sIdx) * 10;
            costs.push({
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

    return costs;
  }

  static generateResources(): CloudResource[] {
    return [
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
  }

  static generateRecommendations(): Recommendation[] {
    return [
      { id: 1, resource_id: 'i-09f1a23b4c5d6e7f8', service: 'EC2', type: 'Stop Idle', description: 'Stop idle EC2 instance prod-auth-service (i-09f1a23b4c5d6e7f8) showing average CPU < 5% over 14 days.', estimated_savings: 138.24, confidence: 98.0, risk_level: 'Low', complexity: 'Low', status: 'Active' },
      { id: 2, resource_id: 'db-rds-postgresql-replica', service: 'RDS', type: 'Rightsize', description: 'Downsize dev-read-replica from db.m5.large to db.t3.medium. Current CPU utilization is under 2%.', estimated_savings: 126.0, confidence: 92.5, risk_level: 'Low', complexity: 'Medium', status: 'Active' },
      { id: 3, resource_id: 's3-bucket-financial-logs-archive', service: 'S3', type: 'S3 Tiering', description: 'Move standard storage objects in finance-logs-archive bucket to Glacier Deep Archive for objects older than 90 days.', estimated_savings: 280.50, confidence: 95.0, risk_level: 'Low', complexity: 'Low', status: 'Active' },
      { id: 4, resource_id: 'i-08a9b8c7d6e5f4g3h', service: 'EC2', type: 'Spot Instance', description: 'Migrate stateless transaction node in payment-gateway scaling group to Spot Instances.', estimated_savings: 166.40, confidence: 80.0, risk_level: 'Medium', complexity: 'High', status: 'Active' },
    ];
  }

  static generateAlerts(): SystemAlert[] {
    return [
      { id: 1, type: 'CostAnomaly', severity: 'Critical', message: 'Billing spike detected in AWS EC2 Engineering on 2026-05-12. Spend increased by 45% ($520.40 vs 14-day average $365.00).', value: 520.40, threshold: 365.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 2, type: 'BudgetBreach', severity: 'Warning', message: 'AWS May Budget limit warning. Current forecasted spend is $15,840.00, which exceeds 75% of budget ($15,000.00).', value: 15840.00, threshold: 15000.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
      { id: 3, type: 'IdleResource', severity: 'Info', message: 'Underutilized RDS replica dev-read-replica running for 14 days with CPU < 2%. Consider downsizing.', value: 126.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
    ];
  }
}
