import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export class WsServer {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ noServer: true });
    
    server.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request);
      });
    });

    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WEBSOCKET] Client connected to live FinOps stream.');

      // Start simulated telemetry scanner for this client connection
      const telemetryInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          // Send simulated CPU metrics tick for a random instance
          const randomCpuVal = Math.round((Math.random() * 85 + 2) * 100) / 100;
          ws.send(JSON.stringify({
            type: 'METRIC_TICK',
            payload: {
              resource_id: 'i-08a9b8c7d6e5f4g3h',
              cpu_utilization: randomCpuVal
            }
          }));
        }
      }, 5000);

      // Periodically trigger a mock cost spike anomaly (every 45s)
      const anomalyInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ALERT_ANOMALY',
            payload: {
              id: Date.now(),
              type: 'CostAnomaly',
              severity: 'Critical',
              message: `[Live SPIKE] Cost anomaly detected on EKS worker node! Billing rate jumped to $0.48/hr (+80% increase).`,
              value: 0.48,
              threshold: 0.20,
              is_resolved: false,
              created_at: new Date().toISOString()
            }
          }));
        }
      }, 45000);

      ws.on('close', () => {
        clearInterval(telemetryInterval);
        clearInterval(anomalyInterval);
        console.log('[WEBSOCKET] Client disconnected.');
      });
    });
  }
}
export default WsServer;
