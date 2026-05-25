-- PostgreSQL database schema for FinOps platform

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and RBAC
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'User', -- 'Admin', 'User', 'Finance'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cloud credentials metadata
CREATE TABLE IF NOT EXISTS cloud_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'AWS', 'GCP', 'Azure'
    credentials_json TEXT, -- Masked/encrypted credentials configuration
    status VARCHAR(50) DEFAULT 'Connected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily billing & forecasted costs
CREATE TABLE IF NOT EXISTS cost_metrics (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    service VARCHAR(100) NOT NULL, -- 'EC2', 'RDS', 'S3', 'Lambda', etc.
    department VARCHAR(100) NOT NULL DEFAULT 'Engineering', -- 'Engineering', 'Data Science', 'Operations', 'Finance'
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    is_forecast BOOLEAN DEFAULT FALSE,
    confidence_lower NUMERIC(12, 2), -- Lower bound prediction interval
    confidence_upper NUMERIC(12, 2), -- Upper bound prediction interval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cloud resources telemetry
CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    resource_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    type VARCHAR(100) NOT NULL, -- 'ec2', 'rds', 's3', 'lambda', 'eks'
    region VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'running', 'stopped', 'active'
    cost_per_hour NUMERIC(10, 4) NOT NULL,
    cpu_utilization NUMERIC(5, 2),
    memory_utilization NUMERIC(5, 2),
    network_in_out NUMERIC(15, 2), -- in bytes
    is_idle BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FinOps Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(255) REFERENCES resources(resource_id) ON DELETE CASCADE,
    service VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'Stop Idle', 'Rightsize', 'S3 Tiering', 'Spot Instance'
    description TEXT NOT NULL,
    estimated_savings NUMERIC(12, 2) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL, -- percentage
    risk_level VARCHAR(50) NOT NULL, -- 'Low', 'Medium', 'High'
    complexity VARCHAR(50) NOT NULL, -- 'Low', 'Medium', 'High'
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Applied', 'Dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Real-time anomalies and budget alerts
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- 'CostAnomaly', 'BudgetBreach', 'IdleResource'
    severity VARCHAR(50) NOT NULL, -- 'Info', 'Warning', 'Critical'
    message TEXT NOT NULL,
    value NUMERIC(12, 2),
    threshold NUMERIC(12, 2),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
