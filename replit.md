# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that integrates AI-powered pet training services with an online shopping experience for pet supplies. It aims to serve pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry with integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Enhanced font sizes and accessibility-focused design with improved touch targets and typography.

## System Architecture
### Core Architectural Decisions
TALEZ emphasizes modularity, scalability, and performance, utilizing modern web technologies. The architecture supports multi-user roles, real-time interactions, and integrates AI capabilities for personalized experiences. Key design decisions include a consistent UI/UX with a simplified color palette, a hybrid location search system, and robust authentication with role-based access control.

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React hooks, context, TanStack Query
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Session Management**: Express session
- **Authentication**: Multi-provider with role-based access control
- **Real-time**: WebSocket service

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Migrations**: Drizzle Kit
- **Validation**: Zod schemas

### Key Features
- **Authentication System**: Multi-provider support (Native, Kakao, Naver, Google OAuth), secure session management, role-based access.
- **E-commerce Platform**: Product catalog, shopping cart, payment integration, order management.
- **Educational Services**: Course management, trainer profiles, pet profiles, AI-powered recommendations, curriculum creation, video management.
- **AI Features**: AI-powered pet training, content crawling, multi-model AI fusion (OpenAI, Gemini) for various analyses, automatic subtitle generation.
- **Admin Dashboard**: Comprehensive management for users, trainers, institutes, content, revenue, and registrations.
- **Location Services**: Hybrid search system (TALEZ database + Google Places API) for pet-related establishments, Google Maps integration, real-time distance calculation.
- **Design System**: Consistent UI/UX with enhanced typography, accessibility-focused design (44px min touch targets), unified button styles, simplified color palette (TALEZ Green primary).
- **Deployment Strategy**: Production-ready Docker containerization, PM2 cluster mode, Nginx reverse proxy, automated backup, GitHub Actions CI/CD for AWS EC2.
- **Vaccination Schedule Management**: Comprehensive system for tracking pet vaccinations, including hospital location, 7 REST API endpoints for CRUD, Google Maps integration, status management, and upcoming appointment notifications.
- **Zoom Meeting Integration**: In-service video call participation using Zoom Meeting SDK for live classes.

## External Dependencies
- **Database**: PostgreSQL (Neon serverless)
- **Email**: SendGrid
- **Payments**: Toss Payments, Stripe
- **Maps**: Google Maps API
- **AI Services**: OpenAI, Google Gemini
- **Monitoring**: Sentry
- **Authentication**: Kakao, Naver, Google (OAuth providers)
- **Avatars**: Dicebear API
- **Video Processing**: FFmpeg
- **Video Conferencing**: Zoom Meeting SDK