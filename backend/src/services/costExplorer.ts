import {
  CostExplorerClient,
  GetCostAndUsageCommand,
} from "@aws-sdk/client-cost-explorer";

const client = new CostExplorerClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || "",
  },
});

export async function getAWSCosts() {
  try {
    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: "2026-05-01",
        End: "2026-05-25",
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
    });

    const response = await client.send(command);

    return response.ResultsByTime || [];
  } catch (error) {
    console.error("[AWS COST EXPLORER ERROR]", error);
    throw error;
  }
}