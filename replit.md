# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that integrates AI-powered pet training services with an online shopping experience for pet supplies. It aims to serve pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry with integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## Recent Changes (December 7, 2025)
### WebRTC Streaming System (Google Meet Replacement)
- **Architecture Change**: Replaced Google Meet iframe (blocked by X-Frame-Options) with custom WebRTC solution
- **Socket.IO Server**: Real-time signaling server at `/streaming` namespace with `/streaming-socket` path
  - `server/streaming/socket-server.ts` - Full signaling implementation
  - Events: join-stream, leave-stream, signal, chat-message, end-stream, disconnect
  - Viewer count tracking with automatic cleanup on disconnect
- **WebRTC Components**: 
  - `StreamSession.tsx` - Host/viewer P2P video streaming with simple-peer
  - `useStreamingSocket.ts` - Custom hook for Socket.IO connection management
  - `LiveStreamViewer.tsx` - Enhanced viewer UI with embedded player and chat
- **Database Extensions**: Added `streamPeers`, `streamRecordings`, `streamAnalytics`, `streamSchedules` tables
- **Video-call Page Integration**: Hosts see StreamSession component when broadcasting, viewers see LiveStreamViewer
- **Packages Added**: simple-peer, socket.io, socket.io-client
- **Key Features**:
  - P2P video/audio streaming with STUN servers for NAT traversal
  - Real-time chat via Socket.IO
  - Connection quality monitoring
  - Viewer count tracking and analytics
  - Role-based access (only trainers/institute-admins/admins can host)

### Live Streaming Feature for Video Classes
- **Database Schema**: Added `liveStreams`, `streamViewers`, `streamChatMessages` tables with comprehensive status tracking
- **REST API Endpoints**: Full CRUD operations at `/api/live-streaming/*`
  - Stream management: create, start, end (trainer/institute/admin only)
  - Viewer tracking: join, leave with watch time calculation
  - Real-time chat: get/post messages during streams
- **Role-based Authorization**: Only trainers, institute-admins, and admins can create/manage streams
- **Frontend UI**: New "라이브 방송" tab on video-call page with stream cards, creation form, and viewer stats
- **Real-time Updates**: 10-second polling for viewer counts and stream status updates
- **Security**: All stream management endpoints require proper role authentication

## Previous Changes (December 6, 2025)
### Comprehensive Notification System Integration
- **All Major Actions Now Trigger Notifications**: 
  - Event registration: Sends notification to user on successful event signup (`server/events/routes.ts`)
  - Message reception: Dual delivery via WebSocket (real-time) + FCM (background) (`server/routes/messaging.ts`)
  - Course enrollment: Notification on successful payment and enrollment (`server/routes.ts`)
  - Order completion: Notification when product purchase is confirmed (`server/routes.ts`)
  - Post likes: Notifies post author when their content receives likes (`server/routes/social.ts`)
  - Post comments: Notifies post author when new comments are added (`server/routes/social.ts`)
- **NotificationService Integration**: Centralized notification handling via `server/notifications/notification-service.ts`
  - WebSocket delivery for online users
  - FCM push notifications for background/offline users
  - Database persistence for notification history
- **Messaging System**: Fixed REST API polling with proper queryFn for conversation messages (10s polling for list, 3s for active conversation)

### Sidebar Menu Structure Optimization
- **Role-based Menu Organization**: Consolidated management menus under "운영 관리" group
  - Trainer-specific menus: `/trainer/my-points`, `/trainer/rest-management`, `/trainer/substitute-board`, `/trainer/notebook`, `/trainer/settings`
  - Institute-admin-specific menus: `/institute/my-points`, `/institute/rest-management`, `/institute/substitute-management`, `/institute/notebook-monitor`, `/institute/trainers`, `/institute/facility`
  - Shared menus: `/trainer/courses`, `/trainer/students`, `/trainer/earnings` (visible to both roles)
- **Admin Multi-role Access**: Admin users see both trainer and institute-admin menus simultaneously via existing showTrainerMenu/showInstituteMenu flags
- **Route Preservation**: Maintained separate legacy routes for each role to preserve component-specific functionality

## Previous Changes (November 15, 2025)
### Banner Images & UI Consistency
- **All Pages Banner Update**: Replaced external Unsplash images with custom TALEZ Green branded banner images
  - Pages updated: Home (3 banners), Video Call, Shop, Trainers, Courses, Notebook, Institutes
  - Standardized gradient overlay: `from-black/60 via-black/40 to-transparent`
  - All banners now use local assets from `attached_assets/stock_images/`
  - Consistent TALEZ Green (#2C8C7D) color scheme across all banners
- **Click Event Fixes**: Added missing onClick handlers
  - Courses page: "고급 필터" button now toggles advanced filter visibility
  - Shop page: Banner "더 알아보기" button implements category search
  - Video Call page: "공유" buttons with 3-tier fallback (Web Share API → Clipboard API → Toast notification)
  - All share buttons include proper error handling and feature detection

### Firebase Cloud Messaging (FCM) Integration
- **Backend**: FCMService implementation with Firebase Admin SDK for push notification delivery
  - NotificationOrchestrator pattern: DB persistence → WebSocket (real-time) → FCM (background)
  - Multi-device support with automatic invalid token cleanup
  - API endpoints: `/api/fcm/register-token`, `/api/fcm/unregister-token`, `/api/fcm/tokens`
- **Frontend**: Service Worker + FCM client integration
  - Lazy Firebase initialization with graceful degradation (works without FCM credentials)
  - Background message handling in `firebase-messaging-sw.js`
  - NotificationProvider enhanced with FCM token management
- **Database**: `fcmTokens` table for device token management
- **Required env vars**: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID (backend), VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID, VITE_FIREBASE_VAPID_KEY (frontend)

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
- **Google Meet Integration**: Video conferencing using Google Meet API for live classes with link-based meeting creation.
- **Push Notifications**: Firebase Cloud Messaging (FCM) integration for real-time push notifications with WebSocket fallback, multi-device support, and graceful degradation.
- **Live Streaming**: Trainer-hosted live broadcasts with real-time viewer tracking, chat functionality, and role-based access control (`server/routes/live-streaming.ts`).

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
- **Video Conferencing**: Google Meet API
- **Push Notifications**: Firebase Cloud Messaging (FCM)