export interface ShieldOptions {
  apiKey: string;
  backendUrl?: string; // e.g. http://localhost:5000/api/sdk
  mode?: 'cloud' | 'private';
  failOpen?: boolean; // If true, allow query if backend is unreachable
  timeoutMs?: number; // Request timeout
}

export interface AnalyzePayload {
  apiKey: string;
  databaseType: string;
  query: string;
  endpoint?: string;
  httpMethod?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  executionTimeMs?: number;
  sdkVersion: string;
  appVersion?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data: {
    status: 'allow' | 'block';
    risk: 'none' | 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    reason: string;
    recommendation?: string;
    ruleId?: string;
    threats?: any[];
  };
}

export interface ShieldTelemetry {
  attackDetected: boolean;
  executionTimeMs: number;
  sdkVersion: string;
  platform: string;
  databaseType: string;
  apiLatencyMs: number;
}
