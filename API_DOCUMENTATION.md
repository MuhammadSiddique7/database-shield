# 🛡️ Database Shield — API Documentation

**Base URL:** `http://localhost:5000/api`

**Authentication:** Bearer JWT Token (in Authorization header)

---

## Authentication Endpoints

### Register
```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-19T..."
  }
}
```

---

### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-07-19T..."
  }
}
```

---

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

---

### Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

### Forgot Password
```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
```
POST /api/auth/reset-password/:token
```

**Body:**
```json
{
  "password": "newpassword123"
}
```

---

## Project Endpoints

### List Projects
```
GET /api/projects
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "My App",
      "description": "Production database",
      "databaseType": "PostgreSQL",
      "apiKey": "ds_live_a1b2c3...",
      "status": "active",
      "totalRequests": 150,
      "blockedRequests": 12,
      "createdAt": "2026-07-19T..."
    }
  ]
}
```

---

### Create Project
```
POST /api/projects
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "My Application",
  "description": "Production database protection",
  "databaseType": "MySQL"
}
```

---

### Get Project
```
GET /api/projects/:id
Authorization: Bearer <token>
```

---

### Update Project
```
PUT /api/projects/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

---

### Delete Project
```
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

### Regenerate API Key
```
POST /api/projects/:id/regenerate-key
Authorization: Bearer <token>
```

---

## Query Analysis

### Analyze Query ⚡
```
POST /api/analyze-query
```

> **Note:** This endpoint uses API Key authentication, not JWT.

**Body:**
```json
{
  "query": "SELECT * FROM users WHERE id = 1 OR 1=1",
  "databaseType": "MySQL",
  "ip": "192.168.1.100",
  "projectApiKey": "ds_live_your_api_key_here"
}
```

**Response — Blocked (200):**
```json
{
  "success": true,
  "data": {
    "status": "block",
    "risk": "high",
    "confidence": 94.5,
    "reason": "SQL Injection Detected: Boolean-based injection (OR 1=1)",
    "threats": [
      {
        "type": "Boolean Injection",
        "description": "Detected OR condition with tautology (1=1)",
        "severity": "high"
      }
    ]
  }
}
```

**Response — Allowed (200):**
```json
{
  "success": true,
  "data": {
    "status": "allow",
    "risk": "none",
    "confidence": 95.0,
    "reason": "Query appears safe. No SQL injection patterns detected.",
    "threats": []
  }
}
```

---

## Dashboard Endpoints

### Get Statistics
```
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRequests": 1250,
    "safeRequests": 1180,
    "blockedRequests": 70,
    "highRiskRequests": 25,
    "totalProjects": 3
  }
}
```

---

### Get Recent Activity
```
GET /api/dashboard/recent
Authorization: Bearer <token>
```

---

### Get Chart Data
```
GET /api/dashboard/chart?days=7
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "date": "2026-07-13", "safe": 45, "blocked": 3 },
    { "date": "2026-07-14", "safe": 52, "blocked": 7 },
    { "date": "2026-07-15", "safe": 38, "blocked": 2 }
  ]
}
```

---

## Log Endpoints

### Get Query Logs
```
GET /api/logs?page=1&limit=20&status=block&risk=high&search=SELECT
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Number | 1 | Page number |
| limit | Number | 20 | Items per page |
| status | String | - | Filter: allow, block |
| risk | String | - | Filter: none, low, medium, high, critical |
| project | String | - | Filter by project ID |
| search | String | - | Search in query text |

---

### Get Single Log
```
GET /api/logs/:id
Authorization: Bearer <token>
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Credentials |
| 403 | Forbidden / Not Owner |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable (Detection Engine Down) |

---

## Rate Limits

| Route Group | Limit |
|------------|-------|
| Authentication | 20 requests / 15 min |
| API Endpoints | 100 requests / 15 min |
