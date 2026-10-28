# 🛡️ Database Shield — Database Schema

## Collections

---

### Users

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | auto | - | Primary key |
| name | String | ✅ | - | Max 50 chars, trimmed |
| email | String | ✅ | - | Unique, lowercase, trimmed |
| password | String | ✅ | - | Min 6 chars, bcrypt hashed, select: false |
| resetPasswordToken | String | - | - | SHA256 hashed reset token |
| resetPasswordExpire | Date | - | - | Token expiry (10 min from creation) |
| createdAt | Date | - | Date.now | Account creation timestamp |

**Indexes:** email (unique)

**Pre-save Hook:** Hashes password with bcrypt (salt 12) if modified.

**Methods:**
- `matchPassword(password)` — Compares plaintext with hash
- `getSignedJwtToken()` — Returns signed JWT
- `getResetPasswordToken()` — Generates reset token, stores hash, returns plaintext

---

### Projects

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | auto | - | Primary key |
| name | String | ✅ | - | Max 100 chars, trimmed |
| description | String | - | '' | Max 500 chars, trimmed |
| databaseType | String | ✅ | - | Enum: MySQL, PostgreSQL, MongoDB, SQLite, MSSQL, Oracle, Other |
| apiKey | String | ✅ | auto | Unique, format: ds_live_{64 hex chars} |
| user | ObjectId | ✅ | - | Ref: User |
| status | String | - | 'active' | Enum: active, inactive |
| totalRequests | Number | - | 0 | Incremented on each analyze-query call |
| blockedRequests | Number | - | 0 | Incremented when query is blocked |
| createdAt | Date | - | Date.now | Project creation timestamp |

**Indexes:** apiKey (unique), user

**Pre-save Hook:** Auto-generates API key if not set.

---

### QueryLogs

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| _id | ObjectId | auto | - | Primary key |
| query | String | ✅ | - | The SQL query analyzed |
| databaseType | String | - | 'Unknown' | Database type context |
| ip | String | - | 'unknown' | Client IP address |
| status | String | ✅ | - | Enum: allow, block |
| risk | String | ✅ | - | Enum: none, low, medium, high, critical |
| confidence | Number | ✅ | - | 0-100, detection confidence |
| reason | String | ✅ | - | Human-readable detection reason |
| threats | Array | - | [] | Array of { type, description, severity } |
| project | ObjectId | ✅ | - | Ref: Project |
| user | ObjectId | ✅ | - | Ref: User |
| createdAt | Date | - | Date.now | Log timestamp |

**Indexes:** project, user, createdAt, { project: 1, createdAt: -1 } (compound)

---

## Relationships

```
User (1) ──── (N) Project
User (1) ──── (N) QueryLog
Project (1) ── (N) QueryLog
```

## Data Flow

1. User registers → User document created
2. User creates project → Project document with auto-generated API key
3. External app sends query with API key → QueryLog document created
4. Dashboard aggregates QueryLog data for statistics
