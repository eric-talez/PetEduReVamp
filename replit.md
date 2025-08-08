# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that combines AI-powered pet training services with an online shopping experience for pet supplies. It serves pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry by offering integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Enhanced font sizes and accessibility-focused design with improved touch targets and typography.

## System Architecture
### Core Architectural Decisions
TALEZ is built with a strong emphasis on modularity, scalability, and performance, utilizing modern web technologies. The architecture supports multi-user roles, real-time interactions, and integrates AI capabilities for personalized experiences.

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Radix UI for accessible, headless components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite
- **State Management**: React hooks, context, and TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Performance**: Optimized query hooks, infinite scroll, conditional rendering

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Session Management**: Express session with secure configuration
- **Authentication**: Multi-provider authentication with role-based access control
- **Error Handling**: Custom error classes with logging
- **Performance**: Compression, rate limiting, caching, response optimization
- **Real-time**: WebSocket service with heartbeat and room management

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Migrations**: Drizzle Kit
- **Validation**: Zod schemas

### Key Features
- **Authentication System**: Multi-provider support (Native, Kakao, Naver, Google OAuth), secure session management, role-based access, identity verification.
- **E-commerce Platform**: Product catalog, shopping cart, Stripe integration for payments, order management.
- **Educational Services**: Course management, trainer profiles, pet profiles, AI-powered recommendations, curriculum creation with Excel integration and video management.
- **Communication Features**: Email services (SendGrid), real-time chat, notifications.
- **AI Features**: AI-powered pet training services, content crawling for news, multi-model AI fusion (OpenAI, Gemini) for behavior, training, health, and sentiment analysis, automatic subtitle generation for videos.
- **Admin Dashboard**: Comprehensive management for users, trainers, institutes, content, curriculum, revenue, and registrations. Enhanced visual analytics with circular progress bars.
- **Location Services**: Naver Maps integration for pet-related facilities with reservation functionality.
- **Design System**: Consistent UI/UX with enhanced typography system, improved font sizes (16px base), accessibility-focused design with 44px minimum touch targets, unified button styles, and enhanced visual elements including an AI-focused design for experience sections. Color scheme adheres to Figma specifications: Primary: #2BAA61, Secondary: #FFA726, Information: #29B5F6, Danger: #E74D3C.
- **Deployment Strategy**: Dockerized for containerization, PM2 for process management, Nginx for reverse proxy. Configured for cloud deployment with automated Git-based CI/CD via GitHub Actions.

## External Dependencies
- **Database**: PostgreSQL (via Neon serverless)
- **Email**: SendGrid
- **Payments**: Stripe
- **Maps**: Naver Maps API, Kakao Maps API
- **AI Services**: OpenAI, Google Gemini
- **Monitoring**: Sentry
- **Authentication**: Kakao, Naver, Google (OAuth providers)
- **Avatars**: Dicebear API
- **Video Processing**: FFmpeg