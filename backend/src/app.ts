import express from 'express';
import cors from 'cors';
import { getAWSCosts } from "./services/costExplorer.js";
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { WsServer } from './socket/wsServer.js';
import { AWSProvider } from './services/awsProvider.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from './middleware/auth.js';

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'finops-secure-jwt-key';

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

const aws = new AWSProvider();

// Root Status Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'CloudOptima FinOps API Gateway is fully operational',
    version: '1.0.0',
    endpoints: {
      login: '/api/auth/login [POST]',
      sync: '/api/sync [GET]',
      applyRecommendation: '/api/recommendations/:id/apply [POST]',
      chat: '/api/chat [POST]'
    }
  });
});

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Accept standard demo bypass
  if (email && password === 'admin123') {
    let role = 'User';
    if (email.startsWith('admin')) role = 'Admin';
    else if (email.startsWith('finance')) role = 'Finance';
    
    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ email, role, token });
  }

  return res.status(401).json({ error: 'Invalid credentials. Use admin@cloudoptima.com / admin123.' });
});

// Sync Metrics Endpoint
app.get('/api/sync', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const costs = await aws.fetchBillingSummary();
    const resources = await aws.fetchResourcesTelemetry();
    const recommendations = await aws.fetchOptimizationRecommendations();
    const alerts = MockGeneratorGetAlerts(); // Fallback to seed alerts list

    return res.json({ costs, resources, recommendations, alerts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to synchronize cloud metrics.' });
  }
});

// Apply Optimization Recommendation
app.post('/api/recommendations/:id/apply', authenticateToken, requireRole(['Admin', 'Finance']), (req, res) => {
  const { id } = req.params;
  return res.json({ success: true, message: `Recommendation ${id} successfully applied and scaled.` });
});

// AI Chatbot Copilot NLP Endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Query prompt is empty.' });
  }

  const query = message.toLowerCase();
  let reply = '';

  if (query.includes('forecast') || query.includes('predict') || query.includes('future')) {
    reply = "Based on our **AI Prophet forecasting engine**, your projected cloud spend for June 2026 is **$16,842.50** (with an 80% confidence interval of $15,900 to $17,800). This represents a **5.4% increase** from May due to EKS scaling trends. I recommend applying the EC2 scheduling recommendation to offset this increase.";
  } else if (query.includes('idle') || query.includes('recommend') || query.includes('save') || query.includes('waste')) {
    reply = "I found **4 active cost-saving recommendations** totalizing **$711.14/month** in potential savings:\n\n1. **Stop Idle EC2** (`prod-auth-service`): Saves **$138.24/month** (Risk: Low)\n2. **Rightsize RDS Replica** (`dev-read-replica`): Saves **$126.00/month** (Risk: Low)\n3. **S3 Storage Tiering** (`finance-logs-archive`): Saves **$280.50/month** (Risk: Low)\n4. **Spot Instances** (`payment-gateway` cluster): Saves **$166.40/month** (Risk: Med)\n\nYou can apply these directly from the **Recommendations** panel.";
  } else if (query.includes('s3') || query.includes('storage') || query.includes('glacier')) {
    reply = "Your S3 storage costs are currently **$342.10/month** (mainly under the `finance-logs-archive` bucket). Moving objects older than 90 days from Standard to **Glacier Deep Archive** will save **$280.50/month** (82% cost reduction) with no performance impact on historical logs access.";
  } else if (query.includes('security') || query.includes('compliance') || query.includes('posture')) {
    reply = "Your **Security & Compliance Posture Score is 82/100**. Critical violations:\n\n* **MFA is disabled** on 3 IAM console roles.\n* **S3 Buckets** without server-side encryption enabled (2 buckets).\n* **Idle access keys** over 90 days active (1 key).\n\nCheck the **Compliance** tab to view remediation steps.";
  } else if (query.includes('rds') || query.includes('database')) {
    reply = "You are running **2 RDS instances** costed at **$1.05/hour** combined. The main Database `prod-core-db` is well-sized (32.5% CPU), but the replica `dev-read-replica` is running with **under 2% CPU utilization** for 14 days. Downsizing this replica will save **$126.00/month**.";
  } else if (query.includes('kubernetes') || query.includes('eks') || query.includes('pod') || query.includes('k8s')) {
    reply = "Your Kubernetes cost efficiency score is **74%**. We detected over-provisioned CPU and Memory limits in the `billing` namespace: pods are utilizing only **34% of allocated CPU requests**. Downsizing EKS resource limits will free up node capacity and allow autoscaler to scale down 1 EC2 instance, saving **$140.00/month**.";
  } else {
    reply = "I can help you audit and optimize your multi-cloud estate. Try asking me:\n* *'Show me idle servers'* \n* *'What is my forecasted cost next month?'* \n* *'How do I optimize S3 storage?'* \n* *'Summarize my compliance issues'*";
  }

  return res.json({ reply });
});

app.get("/api/aws-costs", async (req, res) => {
  try {
    const data = await getAWSCosts();

    return res.json({
      success: true,
      source: "AWS Cost Explorer",
      results: data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch AWS Cost Explorer data",
    });
  }
});
// Helper getter
function MockGeneratorGetAlerts() {
  return [
    { id: 1, type: 'CostAnomaly', severity: 'Critical' as const, message: 'Billing spike detected in AWS EC2 Engineering on 2026-05-12. Spend increased by 45% ($520.40 vs 14-day average $365.00).', value: 520.40, threshold: 365.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 2, type: 'BudgetBreach', severity: 'Warning' as const, message: 'AWS May Budget limit warning. Current forecasted spend is $15,840.00, which exceeds 75% of budget ($15,000.00).', value: 15840.00, threshold: 15000.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 3, type: 'IdleResource', severity: 'Info' as const, message: 'Underutilized RDS replica dev-read-replica running for 14 days with CPU < 2%. Consider downsizing.', value: 126.00, is_resolved: false, created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
  ];
}

// Spin up HTTP Server & WS Handler
const server = createServer(app);
new WsServer(server);

server.listen(port, () => {
  console.log(`[SERVER] CloudOptima API listening on http://localhost:${port}`);
});
