# 🛡️ Database Shield — Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-19

### Added

#### Foundation
- Initialized monorepo with backend, frontend, and detection-engine
- Configured environment variables for all services
- Set up Tailwind CSS with custom cybersecurity theme
- Created SVG shield favicon

#### Authentication
- User registration with email validation
- Login with JWT token generation
- Logout functionality
- Forgot password with email token
- Reset password with secure token verification
- User profile view and update
- Change password with current password verification
- JWT authentication middleware
- Rate limiting on auth routes

#### Projects
- Create projects with name, description, database type
- Auto-generated secure API keys (ds_live_* format)
- View all user projects
- Update project details
- Delete projects with cascading log cleanup
- Regenerate API keys

#### Detection Engine
- FastAPI-based SQL injection detection service
- 30+ SQL injection detection patterns
- Categories: UNION injection, Boolean injection, Comment injection, Stacked queries, Dangerous keywords, Command execution, Data extraction, Time-based attacks, Tautology, Encoding evasion
- Risk level calculation (none/low/medium/high/critical)
- Confidence scoring algorithm
- Query normalization with URL decode support

#### Query Analysis API
- POST /api/analyze-query endpoint
- API key-based authentication
- Integration with Python detection engine
- Automatic query logging
- Project statistics updates

#### Dashboard
- Overview statistics (total, safe, blocked, high-risk)
- Line chart for safe vs blocked queries over time
- Risk distribution donut chart
- Recent activity table
- Responsive grid layout

#### Logs
- Paginated query log listing
- Filter by status, risk level, project
- Search by query content
- Expandable log details with threat information

#### Documentation
- Tabbed documentation portal
- Introduction and overview
- Authentication guide
- Complete API reference
- Integration examples (Node.js, Python, cURL)
- Code examples with syntax highlighting

#### Landing Page
- Hero section with animated elements
- Features grid with 6 security features
- How it works 3-step flow
- Pricing section (Free tier active, Pro/Enterprise coming soon)
- FAQ accordion
- Full footer with navigation

#### UI/UX
- Dark cybersecurity theme
- Glassmorphism card effects
- Framer Motion animations throughout
- Fully responsive (mobile, tablet, desktop)
- Loading states for all async operations
- Empty states for no-data scenarios
- Error states with retry capability
- Toast notifications for user feedback

#### Fixes & Integration
- Fixed React Icons `hi2` library compilation errors (`HiOutlineMenu` -> `HiBars3`, etc.)
- Upgraded Python FastAPI to `0.139.2` and Pydantic to `2.13.4` for Python 3.14 compatibility
- Updated `main.py` FastAPI app to use modern `lifespan` context manager instead of deprecated `on_event`
- Made Mongoose MongoDB connection resilient to network drops (`family: 4` for IPv4 enforcement, timeouts)
- Fixed frontend API response unwrapping nested data objects
- Successfully executed End-to-End integration test covering React Frontend -> Express Backend -> FastAPI Python Engine
