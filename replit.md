# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that combines AI-powered pet training services with an online shopping experience for pet supplies. It serves pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry by offering integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## Recent Changes
- **2025-10-29**: Fixed banner image cropping across all menu pages - changed object-cover to object-contain in courses, trainers, shop, video-call, and notebook pages to prevent image cutoff and ensure full banner visibility.
- **2025-10-29**: Color system simplified for brand consistency - Primary changed to TALEZ Green (#2BAA61), Secondary/Accent unified to reduce color overload, state colors (success/info/warning/error) reserved for specific statuses only. ChatBot UI simplified by removing all animations and changing button shape from circular to square.
- **2025-10-26**: Location-based search routing - "근처 훈련소 찾기" (Find Nearby Training Centers) menu now uses location/index.tsx with current location detection and nearby place search. Default tab set to "훈련소" (institute) for focused training center search.
- **2025-10-26**: Fixed TabsList mobile overflow - changed from grid to scrollable flex layout with proper spacing and touch targets for better mobile UX.
- **2025-10-26**: institutes/index.tsx updated to use Google Maps instead of Naver Maps for location display.
- **2025-10-25**: Location service UI/UX upgraded to Naver Map style with split-panel layout (left: search results list, right: interactive map). Improved Google Places search keywords to focus on pet-related establishments. Fixed database column references for users table (verification_phone, avatar).
- **2025-10-25**: Enhanced location services with expanded pet-friendly categories (cafe, pension, park) and TALEZ certification badges. Implemented hybrid search system: TALEZ database for trainers/institutes with certification badges, Google Places API for other facilities. Added location fields (latitude, longitude, address) to users and institutes tables for precise location tracking.
- **2025-10-25**: Map service migrated to Google Maps. Removed Naver Maps and implemented GoogleMapView component with customizable markers, category-based coloring, and interactive info windows.
- **2025-10-25**: Payment system migrated to Toss Payments (토스페이먼츠) for Korean market optimization. Stripe kept as optional global payment alternative. Implemented /api/toss/confirm, /api/toss/payment/:paymentKey, and /api/toss/cancel endpoints. Updated checkout.tsx, payment-success.tsx, and payment-failed.tsx for Toss Payments SDK integration.
- **2025-10-25**: Fixed TopBar.tsx duplicate className warnings on message and notification buttons for cleaner console output.
- **2025-01-23**: Migrated from Kakao Maps to Naver Maps API for all location-based services. Created unified NaverMapView component replacing KakaoMapView across all pages (LocationFinder, facilities, institutes, events).
- **2025-01-23**: TopBar mobile optimization complete - all header buttons now meet WCAG AA standards with 44px minimum touch targets and responsive spacing.
- **2025-01-23**: Logo system migrated to PostgreSQL with database-backed settings management via /api/logo (public) and /api/admin/logo (admin) endpoints.

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
- **E-commerce Platform**: Product catalog, shopping cart, Toss Payments integration (primary) with Stripe as optional alternative for payments, order management.
- **Educational Services**: Course management, trainer profiles, pet profiles, AI-powered recommendations, curriculum creation with Excel integration and video management.
- **Communication Features**: Email services (SendGrid), real-time chat, notifications.
- **AI Features**: AI-powered pet training services, content crawling for news, multi-model AI fusion (OpenAI, Gemini) for behavior, training, health, and sentiment analysis, automatic subtitle generation for videos.
- **Admin Dashboard**: Comprehensive management for users, trainers, institutes, content, curriculum, revenue, and registrations. Enhanced visual analytics with circular progress bars.
- **Location Services**: Hybrid location search system prioritizing TALEZ-registered trainers and institutes from database with certification badges, supplemented by Google Places API for clinics, shops, cafes, pensions, and parks. Features include 8 pet-friendly categories, real-time distance calculation, Google Maps integration with interactive markers, and clear TALEZ certification badges for verified providers.
- **Design System**: Consistent UI/UX with enhanced typography system, improved font sizes (16px base), accessibility-focused design with 44px minimum touch targets, unified button styles, and enhanced visual elements. Simplified color palette for brand consistency: Primary (TALEZ Green #2BAA61) for all primary actions/CTA/links, neutral gray for secondary elements, and state colors (Info #29B5F6, Warning #FFA726, Error #E74D3C) used sparingly for specific statuses only.
- **Deployment Strategy**: Production-ready Docker containerization with multi-stage builds, PM2 cluster mode for high availability, Nginx reverse proxy with SSL termination, automated backup system, comprehensive monitoring scripts, and one-click deployment automation. GitHub Actions CI/CD pipeline for AWS EC2 deployment with automated backup and rollback capabilities. Fully configured for immediate commercial launch.

## External Dependencies
- **Database**: PostgreSQL (via Neon serverless)
- **Email**: SendGrid
- **Payments**: Toss Payments (primary, Korean market), Stripe (optional, global)
- **Maps**: Google Maps API
- **AI Services**: OpenAI, Google Gemini
- **Monitoring**: Sentry
- **Authentication**: Kakao, Naver, Google (OAuth providers)
- **Avatars**: Dicebear API
- **Video Processing**: FFmpeg