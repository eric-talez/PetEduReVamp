# Replit.md - AI Dog Voice Analysis Platform

## Overview

This is a full-stack web application for analyzing dog vocalizations using AI technology. The platform allows trainers to record dog sounds, analyze emotions, and build a machine learning model for automatic dog voice analysis. It features a React frontend with shadcn/ui components, an Express.js backend with TypeScript, and uses Drizzle ORM with PostgreSQL for data persistence.

**Latest Update (2025-12-21)**: Migrated AI engine from Anthropic Claude to OpenAI GPT-5.1 via Replit AI Integrations. Enhanced platform with real-time AI analysis capabilities. Integrated PostgreSQL database with extensive schema for research subjects, behavioral analyses, vocal analyses, physiological data, and research findings. Added Korean language support with accessibility features.

**AI Analysis Integration (2025-12-21)**: Comprehensive AI-powered analysis system using OpenAI GPT-5.1 that processes uploaded video and audio files in real-time, providing accurate behavioral insights (posture, behavior, barking), emotional state detection, and professional recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.
Real-time accuracy updates with game-like elements preferred over traditional gamification systems.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Audio Recording**: Web APIs for microphone access and audio recording

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with CRUD operations
- **Request/Response**: JSON-based communication
- **Error Handling**: Centralized error middleware
- **Development**: Hot reloading with Vite dev server integration

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with comprehensive research schema
- **Migrations**: Drizzle Kit for schema migrations
- **Tables**: users, researchers, dogSubjects, researchSessions, behavioralAnalyses, vocalAnalyses, physiologicalData, researchFindings
- **Connection**: Environment-based DATABASE_URL configuration with Neon serverless support

## Key Components

### Database Schema
- **Users**: Basic user authentication system
- **Researchers**: Research professionals with institution, specialization, and credentials
- **Dog Subjects**: Comprehensive dog profiles with breed, age, medical history, behavioral notes, and environment data
- **Research Sessions**: Structured research sessions with environmental conditions and metadata
- **Behavioral Analyses**: Detailed behavioral analysis with body language, facial expressions, and contextual factors
- **Vocal Analyses**: Advanced voice analysis with frequency, amplitude, emotional state, and spectrogram data
- **Physiological Data**: Health metrics including heart rate, stress hormones, and activity metrics
- **Research Findings**: Scientific findings with methodology, statistical significance, and publication status

### Frontend Components
- **ResearchSubjects**: Dog subject management with detailed profiles, search, and filtering
- **BehavioralAnalysis**: Real-time behavioral analysis with live video processing and pattern recognition
- **AudioRecorder**: Web-based audio recording with frequency analysis for vocal patterns
- **StatCard**: Reusable statistics display components with research metrics
- **AccessibilityControls**: Comprehensive accessibility features including text scaling and contrast modes
- **HelpSystem**: Integrated help and guidance system for research workflows
- **Dashboard**: Research-focused interface with subjects, behavioral analysis, audio analysis, and statistics tabs

### Backend Services
- **Storage Layer**: DatabaseStorage implementation with PostgreSQL integration
- **API Routes**: RESTful endpoints for research subjects, researchers, sessions, behavioral analyses, vocal analyses, and statistics
- **Validation**: Zod schema validation for all research data types
- **Database Operations**: Comprehensive CRUD operations with relations and complex queries

## Data Flow

1. **Audio Recording**: User records dog vocalizations through web microphone API
2. **Emotion Tagging**: Trainer manually tags emotions and contextual information
3. **Data Storage**: Audio metadata and analysis results stored in PostgreSQL
4. **AI Processing**: Voice data processed through ML models for emotion prediction
5. **Trainer Verification**: Human trainers verify or correct AI predictions
6. **Model Training**: Verified data used to improve ML model accuracy
7. **Statistics**: Real-time dashboard showing analysis performance and trends

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation
- **express**: Web application framework

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express API proxy
- **Error Handling**: Runtime error overlay for development
- **Cartographer**: Replit-specific debugging tools

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Environment**: Production mode with optimized builds

### Configuration
- **TypeScript**: Shared configuration for client, server, and shared modules
- **Path Aliases**: Simplified imports with `@/` for client and `@shared/` for shared code
- **Asset Handling**: Static assets served through Express in production

## Key Architectural Decisions

### Monorepo Structure
**Problem**: Managing frontend, backend, and shared code in a single repository
**Solution**: Organized into `client/`, `server/`, and `shared/` directories with shared TypeScript configuration
**Rationale**: Simplifies development workflow and enables code sharing between frontend and backend

### Type-Safe Database Operations
**Problem**: Ensuring data integrity and developer experience with database operations
**Solution**: Drizzle ORM with Zod validation schemas
**Rationale**: Provides compile-time type safety and runtime validation

### Component-Based UI Architecture
**Problem**: Building a consistent and accessible user interface
**Solution**: shadcn/ui components with Radix UI primitives and Tailwind CSS
**Rationale**: Ensures accessibility, consistency, and developer productivity

### Real-Time Data Updates
**Problem**: Keeping dashboard data current without manual refreshes
**Solution**: TanStack Query with polling intervals for live data
**Rationale**: Provides smooth user experience with automatic background updates

### Audio Processing Architecture
**Problem**: Handling audio recording and analysis in the browser
**Solution**: Web Audio APIs for recording, backend processing for AI analysis
**Rationale**: Leverages browser capabilities while keeping heavy processing on the server

### Real-Time Gamification System (Added 2025-01-21)
**Problem**: User engagement and sustained interest in accuracy tracking
**Solution**: Interactive leveling system with achievements, real-time accuracy updates, and visual feedback
**Components**: 
- RealTimeAccuracy component with live accuracy calculations
- Achievement system with progress tracking
- Level-based progression with bonuses
- Real-time animation and feedback systems
- Local storage for persistent game state
**Rationale**: Game-like elements increase user motivation and provide immediate feedback on analysis quality without disrupting the core functionality

### Comprehensive Accessibility System (Added 2025-01-21)
**Problem**: Ensuring platform usability for users with diverse accessibility needs
**Solution**: Multi-layered accessibility framework with customizable settings and comprehensive support
**Components**: 
- AccessibilityControls with text scaling, contrast modes, and motion reduction
- Enhanced keyboard navigation with focus indicators and shortcuts
- Screen reader optimization with ARIA labels and semantic structure
- HelpSystem with searchable documentation and contextual guidance
- Visual feedback enhancements and touch target optimization
**Rationale**: Universal design principles ensure the platform is usable by all users, improving overall user experience and compliance with accessibility standards