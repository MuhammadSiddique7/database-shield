# 🛡️ Database Shield — Recovery & Status

## Current Status: MVP Completed ✅

The Database Shield MVP is fully functional, integrated, and verified. 

All core services are communicating successfully:
1. **Frontend (React/Vite)**: `http://localhost:5173`
2. **Backend (Node.js/Express)**: `http://localhost:5000`
3. **Detection Engine (Python/FastAPI)**: `http://localhost:8000`

---

## Service Startup Commands

If the system reboots or processes are killed, run the following commands to restore the application:

### 1. Python Detection Engine
```powershell
cd detection-engine
.\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000
```
*(Requires Python 3.14+ with venv installed)*

### 2. Node.js Backend API
```powershell
cd backend
node server.js
```
*(Requires Node.js v18+ and a valid MongoDB URI in `.env`)*

### 3. React Frontend
```powershell
cd frontend
npx vite --port 5173
```
*(Requires Node.js v18+)*

---

## Known Environment Quirk Recovery

### MongoDB Connection Issues (`ECONNREFUSED` on Windows)
If the Node.js backend fails to connect to MongoDB Atlas with `querySrv ECONNREFUSED`, this is often due to IPv6 / Node.js DNS resolution issues on Windows. 
**Fix applied:**
- Added `family: 4` to Mongoose connection options in `backend/config/db.js`.
- Bypassed the `mongodb+srv://` DNS seedlist by explicitly listing the cluster shard URLs in the `MONGODB_URI` environment variable.

### Python 3.14 Build Issues (Pydantic)
If `pip install` fails when building `pydantic-core` from source via Rust/Cargo:
**Fix applied:**
- Pinned `fastapi>=0.115.0` and `pydantic>=2.10.0` in `requirements.txt` to fetch pre-built wheels compatible with Python 3.14 (`cp314-win_amd64`).

### React Icons Compilation Errors
If Vite fails to build citing missing exports in `react-icons/hi2`:
**Fix applied:**
- Updated incorrect icon names (`HiOutlineMenu` -> `HiBars3`, `HiOutlineFolderAdd` -> `HiOutlineFolderPlus`) directly in component files. The `hi2` pack has different naming conventions than the `hi` pack.
