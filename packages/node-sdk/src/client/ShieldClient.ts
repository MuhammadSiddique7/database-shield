import axios, { AxiosInstance } from 'axios';
import { ShieldOptions, AnalyzePayload, AnalyzeResponse, ShieldTelemetry } from '../types';
import { ShieldSecurityException } from '../errors/ShieldSecurityException';

const SDK_VERSION = '1.0.0';

export class ShieldClient {
  private options: ShieldOptions;
  private api: AxiosInstance;
  private isConnected: boolean = false;

  constructor(options: ShieldOptions) {
    if (!options.apiKey) {
      throw new Error('Database Shield SDK: apiKey is required');
    }

    this.options = {
      backendUrl: 'http://localhost:5000/api/sdk', // Default to local backend for testing
      mode: 'cloud',
      failOpen: true,
      timeoutMs: 3000,
      ...options,
    };

    this.api = axios.create({
      baseURL: this.options.backendUrl,
      timeout: this.options.timeoutMs,
      headers: {
        'Authorization': `Bearer ${this.options.apiKey}`,
        'Content-Type': 'application/json',
        'X-Shield-SDK-Version': SDK_VERSION,
        'X-Shield-Platform': 'Node.js',
      },
    });

    // Start heartbeat in background
    if (this.options.mode === 'cloud') {
      this.startHeartbeat();
    }
  }

  public async analyzeQuery(query: string, databaseType: string = 'unknown'): Promise<boolean> {
    const startTime = Date.now();
    try {
      const payload: AnalyzePayload = {
        apiKey: this.options.apiKey,
        databaseType,
        query,
        timestamp: new Date().toISOString(),
        sdkVersion: SDK_VERSION,
      };

      const response = await this.api.post<AnalyzeResponse>('/analyze', payload);
      
      const executionTimeMs = Date.now() - startTime;
      
      const { status, risk, reason, ruleId } = response.data.data;

      // Telemetry
      this.telemetry({
        attackDetected: status === 'block',
        executionTimeMs,
        sdkVersion: SDK_VERSION,
        platform: 'Node.js',
        databaseType,
        apiLatencyMs: executionTimeMs,
      }).catch(() => {}); // Ignore telemetry errors

      if (status === 'block') {
        throw new ShieldSecurityException(
          `Database Shield blocked a malicious query. Reason: ${reason}`,
          risk,
          reason,
          ruleId
        );
      }

      return true; // allow
    } catch (error) {
      if (error instanceof ShieldSecurityException) {
        throw error; // Re-throw security exception to be handled by app
      }

      // If backend fails and failOpen is true, we allow the query
      if (this.options.failOpen) {
        console.warn(`[Database Shield] Warning: Backend unavailable, failing open. Error: ${(error as Error).message}`);
        return true;
      }

      throw new Error(`[Database Shield] Protection failed and failOpen is false. Error: ${(error as Error).message}`);
    }
  }

  public middleware() {
    // Express middleware to automatically intercept query params if they exist in request body (optional feature)
    return (req: any, res: any, next: Function) => {
      // In a real scenario, middleware might attach the client to req.shield
      // or intercept specific routes. For now we expose the client.
      req.shield = this;
      next();
    };
  }

  public async heartbeat(): Promise<void> {
    try {
      await this.api.post('/heartbeat', {
        timestamp: new Date().toISOString(),
        status: 'active',
      });
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
    }
  }

  private startHeartbeat() {
    this.heartbeat(); // Initial
    setInterval(() => this.heartbeat(), 30000); // Every 30s
  }

  public async version(): Promise<string> {
    return SDK_VERSION;
  }

  public async telemetry(data: ShieldTelemetry): Promise<void> {
    try {
      await this.api.post('/log', data);
    } catch (error) {
      // Telemetry should be silent on failure
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.api.post('/heartbeat', { timestamp: new Date().toISOString() });
      return true;
    } catch (error) {
      return false;
    }
  }
}
