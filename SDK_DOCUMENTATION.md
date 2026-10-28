# Database Shield SDK Documentation

Welcome to the official Developer Integration Platform for Database Shield.

## Architecture Modes

Database Shield supports two primary architectures:
1. **Cloud Mode** (Available): The SDK acts as a middleware and forwards queries securely to the Database Shield Cloud Engine for real-time analysis.
2. **Private Mode** (Enterprise / Coming Soon): The SDK communicates with a local instance of the Detection Engine deployed within your VPC.

## Supported Platforms

- **Node.js**: Fully supported (v1.0.0+)
- **Python**: Coming Soon
- **PHP**: Coming Soon
- **Laravel**: Coming Soon

---

## Node.js SDK Quick Start

### 1. Installation

```bash
npm install @database-shield/node
```

### 2. Initialization

Initialize the SDK as early as possible in your application lifecycle.

```javascript
import Shield from '@database-shield/node';

Shield.initialize({
  apiKey: 'ds_live_YOUR_API_KEY',
  mode: 'cloud', // or 'private'
  failOpen: true, // Allow query execution if backend is unreachable
  timeoutMs: 3000
});
```

### 3. Usage with Database Drivers

#### Automatic Interception (PostgreSQL Example)

```javascript
import { PostgresWrapper } from '@database-shield/node';
import { Client } from 'pg';

const pgClient = new Client({ /* ... config ... */ });
const safeClient = new PostgresWrapper(pgClient, Shield.getClient());

// Malicious queries will throw a ShieldSecurityException
await safeClient.query("SELECT * FROM users WHERE id = '1' OR 1=1");
```

#### Manual Analysis

```javascript
const client = Shield.getClient();

try {
  await client.analyzeQuery("DROP TABLE users;", "PostgreSQL");
  // Execute your query
} catch (error) {
  if (error.name === 'ShieldSecurityException') {
    console.error("Query blocked by Database Shield:", error.reason);
  }
}
```

### 4. Express Middleware

You can easily mount the middleware to automatically inject the shield client or intercept queries in the request body.

```javascript
const express = require('express');
const app = express();

app.use(Shield.middleware());
```

---

## API Reference

### `Shield.initialize(options)`
- `apiKey`: (String) Required. Your project API Key.
- `mode`: (String) 'cloud' or 'private'. Default 'cloud'.
- `failOpen`: (Boolean) Default true.

### `ShieldClient.analyzeQuery(query, databaseType)`
- Returns: `Promise<boolean>` (true if allowed)
- Throws: `ShieldSecurityException` if blocked.

## Security Model
- **HTTPS Only**: All communication to the Cloud Engine uses TLS 1.3.
- **No Secrets Exported**: The SDK only sends the raw query and database type. No database credentials are ever transmitted.
- **Fail Open vs Fail Closed**: Configurable to ensure application uptime even during network partitions.

## Troubleshooting
- **No Heartbeat**: Ensure outbound traffic to `api.databaseshield.com` on port 443 is permitted.
- **High Latency**: Use the `healthCheck()` or `testSdkConnection` in the dashboard to verify latency to the nearest region.
