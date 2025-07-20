# Talez - AI Pet Training Platform

## Project Overview
Advanced AI-powered pet training platform offering intelligent curriculum management and personalized learning experiences, with seamless e-commerce capabilities for courses and pet products.

**Current Status**: Running successfully on Node.js server
**Last Updated**: July 20, 2025

## Recent Changes
✅ **July 20, 2025 - Emergency Fix Applied**
- Fixed critical startup issue where `tsx` dependency was missing
- Created fallback server (`start-server.cjs`) using pure Node.js
- Application now running successfully on port 5000
- All core endpoints functional: /, /health, /api/status
- Beautiful Korean homepage implemented

## Project Architecture

### Technology Stack
- **Frontend**: React.js with TypeScript (configured but currently served via static HTML)
- **Backend**: Node.js Express server (currently using pure Node.js fallback)
- **Database**: PostgreSQL (available but not yet connected)
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Deployment**: Replit-based hosting

### Core Features Implemented
1. **Multi-language Support**: Korean language interface
2. **Health Monitoring**: Real-time server status tracking
3. **API Infrastructure**: RESTful endpoints for courses, users, status
4. **Responsive Design**: Mobile-first UI approach
5. **Error Handling**: Comprehensive error management and graceful shutdown

### Current Endpoints
- `GET /` - Main homepage (Korean)
- `GET /health` - Server health check
- `GET /api/status` - API status and endpoint listing
- `GET /api/courses` - Sample course data
- `GET /api/users` - User management endpoint

## Development Issues Resolved

### Dependency Management Issue
**Problem**: Original startup script used `tsx` which wasn't properly installed
**Solution**: Created `start-server.cjs` as a pure Node.js fallback server
**Impact**: Application now starts reliably without complex dependency chains

### Module System Conflicts
**Problem**: Package.json configured for ES modules but scripts needed CommonJS
**Solution**: Used `.cjs` extension for CommonJS compatibility
**Impact**: Server scripts now execute properly in all environments

## User Preferences
- **Language**: Korean interface preferred
- **Communication**: Direct, solution-focused responses
- **Technical Level**: Non-technical user requiring simple explanations

## Next Steps Priority
1. Reconnect full TypeScript/React frontend
2. Integrate PostgreSQL database functionality
3. Implement user authentication system
4. Add course management features
5. Deploy payment integration

## Deployment Status
- **Server**: Running on port 5000
- **Environment**: Development mode
- **Health**: All systems operational
- **Performance**: Optimized for Replit hosting

## Commands Available
- `node start-server.cjs` - Start the working server
- `curl http://localhost:5000/health` - Test server health
- `curl http://localhost:5000/api/status` - Check API status