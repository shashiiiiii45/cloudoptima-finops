-- Seed data for CloudOptima FinOps platform

-- Seed Users (password for admin is '$2b$10$wKzP3eHj4905v.xUp06KDu6P9V6zQ7rK6V66vA7P/j8q9b9pW3F2m' which corresponds to 'admin123')
INSERT INTO users (email, password_hash, role) VALUES
('admin@cloudoptima.com', '$2b$10$wKzP3eHj4905v.xUp06KDu6P9V6zQ7rK6V66vA7P/j8q9b9pW3F2m', 'Admin'),
('finance@cloudoptima.com', '$2b$10$wKzP3eHj4905v.xUp06KDu6P9V6zQ7rK6V66vA7P/j8q9b9pW3F2m', 'Finance'),
('engineer@cloudoptima.com', '$2b$10$wKzP3eHj4905v.xUp06KDu6P9V6zQ7rK6V66vA7P/j8q9b9pW3F2m', 'User')
ON CONFLICT DO NOTHING;

-- Seed Cloud Accounts
INSERT INTO cloud_accounts (id, name, provider, status) VALUES
(1, 'AWS Enterprise Production', 'AWS', 'Connected'),
(2, 'GCP Data Science Sandbox', 'GCP', 'Connected'),
(3, 'Azure Operations Cluster', 'Azure', 'Connected')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Seed Cost Metrics (Historical and Forecasted Billing)
-- Let's populate the metrics for AWS (Account 1) over a range of dates
-- (The backend mock generator will also dynamically generate these, but this SQL serves as the database base)
INSERT INTO cost_metrics (account_id, provider, service, department, amount, date, is_forecast) VALUES
-- Historical Data (AWS - May 10th to 15th, 2026)
(1, 'AWS', 'EC2', 'Engineering', 450.25, '2026-05-10', FALSE),
(1, 'AWS', 'RDS', 'Engineering', 210.80, '2026-05-10', FALSE),
(1, 'AWS', 'S3', 'Data Science', 340.50, '2026-05-10', FALSE),
(1, 'AWS', 'EKS', 'Operations', 580.00, '2026-05-10', FALSE),
(1, 'AWS', 'Lambda', 'Engineering', 25.40, '2026-05-10', FALSE),

(1, 'AWS', 'EC2', 'Engineering', 465.10, '2026-05-11', FALSE),
(1, 'AWS', 'RDS', 'Engineering', 210.80, '2026-05-11', FALSE),
(1, 'AWS', 'S3', 'Data Science', 342.10, '2026-05-11', FALSE),
(1, 'AWS', 'EKS', 'Operations', 590.20, '2026-05-11', FALSE),
(1, 'AWS', 'Lambda', 'Engineering', 28.90, '2026-05-11', FALSE),

(1, 'AWS', 'EC2', 'Engineering', 520.40, '2026-05-12', FALSE), -- Cost Spike
(1, 'AWS', 'RDS', 'Engineering', 210.80, '2026-05-12', FALSE),
(1, 'AWS', 'S3', 'Data Science', 345.00, '2026-05-12', FALSE),
(1, 'AWS', 'EKS', 'Operations', 620.00, '2026-05-12', FALSE),
(1, 'AWS', 'Lambda', 'Engineering', 50.10, '2026-05-12', FALSE), -- Lambda Spike

-- GCP Historical
(2, 'GCP', 'Compute Engine', 'Data Science', 180.50, '2026-05-10', FALSE),
(2, 'GCP', 'Cloud Storage', 'Data Science', 95.20, '2026-05-10', FALSE),
(2, 'GCP', 'BigQuery', 'Data Science', 240.80, '2026-05-10', FALSE),

(2, 'GCP', 'Compute Engine', 'Data Science', 182.00, '2026-05-11', FALSE),
(2, 'GCP', 'Cloud Storage', 'Data Science', 96.00, '2026-05-11', FALSE),
(2, 'GCP', 'BigQuery', 'Data Science', 320.40, '2026-05-11', FALSE), -- Query spike

-- Azure Historical
(3, 'Azure', 'Virtual Machines', 'Operations', 230.40, '2026-05-10', FALSE),
(3, 'Azure', 'Blob Storage', 'Operations', 80.50, '2026-05-10', FALSE),

(3, 'Azure', 'Virtual Machines', 'Operations', 235.10, '2026-05-11', FALSE),
(3, 'Azure', 'Blob Storage', 'Operations', 81.20, '2026-05-11', FALSE),

-- Forecast Data (AWS - May 25th, 2026)
(1, 'AWS', 'EC2', 'Engineering', 480.00, '2026-05-25', TRUE),
(1, 'AWS', 'RDS', 'Engineering', 215.00, '2026-05-25', TRUE),
(1, 'AWS', 'S3', 'Data Science', 360.00, '2026-05-25', TRUE),
(1, 'AWS', 'EKS', 'Operations', 610.00, '2026-05-25', TRUE);

-- Seed Resources
INSERT INTO resources (account_id, resource_id, name, type, region, status, cost_per_hour, cpu_utilization, memory_utilization, is_idle) VALUES
(1, 'i-09f1a23b4c5d6e7f8', 'prod-auth-service', 'ec2', 'us-east-1', 'running', 0.1920, 4.20, 12.50, TRUE), -- Idle EC2 (t3.xlarge)
(1, 'i-08a9b8c7d6e5f4g3h', 'prod-payment-gateway', 'ec2', 'us-east-1', 'running', 0.3840, 68.40, 72.10, FALSE), -- Active EC2 (t3.2xlarge)
(1, 'db-rds-postgresql-primary', 'prod-core-db', 'rds', 'us-east-1', 'running', 0.7000, 32.50, 85.00, FALSE), -- DB Active
(1, 'db-rds-postgresql-replica', 'dev-read-replica', 'rds', 'us-east-1', 'running', 0.3500, 1.20, 8.40, TRUE), -- Underutilized Replica
(1, 's3-bucket-financial-logs-archive', 'finance-logs-archive', 's3', 'us-east-1', 'active', 0.0230, NULL, NULL, FALSE), -- S3 Bucket
(1, 'lambda-pdf-generator', 'pdf-statement-gen', 'lambda', 'us-east-1', 'active', 0.0001, 12.00, NULL, FALSE),
(1, 'eks-prod-billing-cluster', 'prod-kubernetes-cluster', 'eks', 'us-east-1', 'running', 0.2000, 45.80, 58.90, FALSE);

-- Seed Recommendations
INSERT INTO recommendations (resource_id, service, type, description, estimated_savings, confidence, risk_level, complexity, status) VALUES
('i-09f1a23b4c5d6e7f8', 'EC2', 'Stop Idle', 'Terminate or stop idle EC2 instance prod-auth-service (i-09f1a23b4c5d6e7f8) showing average CPU < 5% over 14 days.', 138.24, 98.00, 'Low', 'Low', 'Active'),
('db-rds-postgresql-replica', 'RDS', 'Rightsize', 'Downsize dev-read-replica from db.m5.large to db.t3.medium. Current CPU utilization is under 2%.', 126.00, 92.50, 'Low', 'Medium', 'Active'),
('s3-bucket-financial-logs-archive', 'S3', 'S3 Tiering', 'Move standard storage objects in finance-logs-archive bucket to Glacier Deep Archive for objects older than 90 days.', 280.50, 95.00, 'Low', 'Low', 'Active'),
('i-08a9b8c7d6e5f4g3h', 'EC2', 'Spot Instance', 'Migrate stateless transaction node in payment-gateway scaling group to Spot Instances.', 166.40, 80.00, 'Medium', 'High', 'Active');

-- Seed Alerts
INSERT INTO alerts (type, severity, message, value, threshold) VALUES
('CostAnomaly', 'Critical', 'Billing spike detected in AWS EC2 Engineering on 2026-05-12. Spend increased by 42% ($520.40 vs 14-day average $365.00).', 520.40, 365.00),
('BudgetBreach', 'Warning', 'AWS May Budget limit warning. Current forecasted spend is $15,840.00, which exceeds 75% of budget ($15,000.00).', 15840.00, 15000.00),
('IdleResource', 'Info', 'Underutilized RDS replica dev-read-replica running for 14 days with CPU < 2%. Consider downsizing.', 126.00, NULL);
