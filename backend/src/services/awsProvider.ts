// AWS Integration Provider
import { MockGenerator } from './mockGenerator.js';
import { CostMetric, CloudResource, Recommendation, SystemAlert } from './types.js';

export class AWSProvider {
  private hasCredentials(): boolean {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION
    );
  }

  async fetchBillingSummary(): Promise<CostMetric[]> {
    if (!this.hasCredentials()) {
      // Fall back to Mock engine immediately
      return MockGenerator.generateCosts();
    }

    try {
      // In a real execution, we import AWS SDK client and execute queries:
      // const client = new CostExplorerClient({ region: process.env.AWS_REGION });
      // const command = new GetCostAndUsageCommand({ ... });
      // const response = await client.send(command);
      // However, we default to MockGenerator if connection fails or during sandbox demo
      return MockGenerator.generateCosts();
    } catch (e) {
      console.warn('AWS billing API connection failed. Reverting to Mock billing data.', e);
      return MockGenerator.generateCosts();
    }
  }

  async fetchResourcesTelemetry(): Promise<CloudResource[]> {
    if (!this.hasCredentials()) {
      return MockGenerator.generateResources();
    }

    try {
      // Simulates fetching EC2 & RDS metrics from Amazon CloudWatch APIs
      return MockGenerator.generateResources();
    } catch (e) {
      return MockGenerator.generateResources();
    }
  }

  async fetchOptimizationRecommendations(): Promise<Recommendation[]> {
    if (!this.hasCredentials()) {
      return MockGenerator.generateRecommendations();
    }

    try {
      // Simulates fetching recommendations from AWS Trusted Advisor
      return MockGenerator.generateRecommendations();
    } catch (e) {
      return MockGenerator.generateRecommendations();
    }
  }
}
