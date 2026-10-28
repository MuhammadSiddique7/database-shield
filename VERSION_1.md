# 🛡️ Database Shield - Version 1.0.0 (Current State)

## Overview
Version 1.0.0 represents the Minimum Viable Product (MVP) of Database Shield. It is a fully functional, cloud-based Security-as-a-Service (SECaaS) platform that protects web applications against SQL Injection (SQLi) attacks. The system intercepts database queries in real-time, analyzes them, and blocks malicious intent before it reaches the database.

## Architecture & Tech Stack
The architecture is designed as a highly decoupled microservices ecosystem:

1. **Frontend (React 18, Vite, Tailwind CSS, Recharts)**
   - Professional landing page.
   - Secure developer dashboard with JWT-based authentication.
   - Real-time visualization of query volume, safe vs. blocked queries, and risk distribution.
   - Project management and secure API key generation.

2. **Core API Backend (Node.js, Express.js, MongoDB)**
   - Handles developer authentication and project metadata.
   - Acts as the central hub routing analysis requests from SDKs to the Detection Engine.
   - Asynchronously logs all queries and telemetry data to MongoDB for dashboard rendering.

3. **Python Detection Engine (FastAPI, Python 3.14)**
   - A high-performance, deterministic rule-based evaluation engine.
   - Utilizes advanced Regular Expressions (`re` module) to normalize and analyze queries.
   - **Current Capabilities:** 30+ sophisticated detection patterns covering UNION-based injections, boolean tautologies, stacked queries, destructive keywords (DROP/TRUNCATE), and time-delay attacks.

4. **Developer Integration Platform (Node.js SDK)**
   - Package: `@database-shield/node`
   - Provides connection wrappers (e.g., `MySQLWrapper`) that seamlessly intercept `db.query()` calls without requiring the developer to rewrite their application logic.

## Limitations of Version 1
- **Deterministic Bounds:** Because V1 relies entirely on regex pattern matching, it is highly accurate against known attack vectors but is vulnerable to complex "Zero-Day" obfuscation techniques that evade signature-based detection.
- **SQL-Exclusive:** Currently, it only parses and understands SQL syntax. It cannot detect NoSQL injection attacks (e.g., MongoDB `$where` or `$ne` operator injections).
- **No IP Tracking/Blocking:** It analyzes the payload but does not maintain a stateful blocklist of malicious IP addresses.
