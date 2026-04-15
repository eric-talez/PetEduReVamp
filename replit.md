# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that integrates AI-powered pet training services with an online shopping experience for pet supplies. It aims to serve pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry with integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Enhanced font sizes and accessibility-focused design with improved touch targets and typography.

## System Architecture
### Core Architectural Decisions
TALEZ emphasizes modularity, scalability, and performance, utilizing modern web technologies. The architecture supports multi-user roles, real-time interactions, and integrates AI capabilities for personalized experiences. Key design decisions include a consistent UI/UX with a simplified color palette, a hybrid location search system, robust authentication with role-based access control, and a custom WebRTC streaming solution. The system also features a comprehensive notification orchestrator for real-time and background delivery.

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
- **Session Management**: Express session (PostgreSQL-backed)
- **Authentication**: Multi-provider with role-based access control (JWT, CSRF protection)
- **Real-time**: WebSocket service (Socket.IO for streaming)
- **Logging**: Winston for structured logging

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Migrations**: Drizzle Kit
- **Validation**: Zod schemas

### Key Features
- **Authentication System**: Multi-provider (Native, Kakao, Naver, Google OAuth), secure session management, role-based access.
- **E-commerce Platform**: Product catalog, shopping cart, payment integration, order management.
- **Educational Services**: Course management, trainer profiles, pet profiles, AI-powered recommendations, curriculum creation, video management.
- **AI Features**: AI-powered pet training, content crawling, multi-model AI fusion (OpenAI, Gemini), automatic subtitle generation.
- **Admin Dashboard**: Comprehensive management for users, trainers, institutes, content, revenue, and registrations, with robust Role-Based Access Control.
- **Location Services**: Hybrid search system (TALEZ database + Google Places API) for pet-related establishments, Google Maps integration.
- **Design System**: Consistent UI/UX with enhanced typography, accessibility-focused design, unified button styles, simplified color palette (TALEZ Green primary).
- **Deployment Strategy**: Production-ready Docker containerization, PM2 cluster mode, Nginx reverse proxy, automated backup, GitHub Actions CI/CD for AWS EC2.
- **Vaccination Schedule Management**: Comprehensive CRUD system with hospital location, Google Maps integration, and notifications.
- **Live Streaming**: Custom WebRTC-based streaming system with Socket.IO for real-time interactions, chat, viewer tracking, and role-based access.
- **Push Notifications**: Firebase Cloud Messaging (FCM) integration with WebSocket fallback for real-time and background notifications across multiple devices.
- **Institute-Trainer Connection**: Secure system for trainers to link with institutes via unique codes, including verification and relationship management.
- **Optimized UI/UX**: Streamlined sidebar menus for various user roles (pet owner, trainer, institute, admin) and consolidated navigation.

## Recent Changes (April 2026)
- **운영 정책 시스템 (Apr 12)**:
  - New `emergency_contacts` table for per-pet emergency contact info (designated hospital, transport consent)
  - New `store_policies` table for institute-level safety rules (leash, treats, contact, children policy)
  - New `consent_records` table for photo/SNS/store-policy/emergency consent management
  - New `incident_protocols` table for incident-type checklists (bite, fight, injury, escape, health emergency)
  - API endpoints: CRUD `/api/emergency-contacts`, GET/POST `/api/store-policies`, CRUD `/api/consent-records`, CRUD `/api/incident-protocols`
  - Role-based access: owner-only emergency contacts, institute-admin store policies, owner consent management, trainer/institute incident protocols
  - Frontend pages: EmergencyInfoPage, StorePolicyManagement, ConsentManagement, IncidentProtocols
  - Sidebar: 매장 규정 + 동의 관리 + 사고 처리 for institute-admin, 사고 처리 for trainer, 응급 정보 + 동의 관리 for pet-owner
  - Routes: `/institute/store-policies`, `/institute/consent-management`, `/institute/incident-protocols`, `/emergency-info`
- **Pet Visit Trust QR 인증 시스템 (Apr 15)**:
  - New `institute_zones` table for zone-based access control (zone type, vaccination requirement, temperament limit, capacity)
  - New `pet_visit_sessions` table for single-use 10-min session tokens with vaccine status, temperament levels, zone permissions
  - API endpoints: CRUD `/api/institute/zones`, POST `/api/visit-sessions/generate`, GET `/api/visit-sessions/verify/:token`, POST `/api/visit-sessions/confirm/:token`, GET `/api/visit-sessions`, GET `/api/institute/members`, GET `/api/institute/members/:memberId/pets`
  - Patent-differentiated design: atomic single-scan invalidation (verify endpoint atomically consumes token via UPDATE WHERE usedAt IS NULL), 10-min expiry, pet-centric trust verification, zone-based permissions
  - Verify atomically: creates checkin_records + marks token used in single request; no separate confirm step needed
  - Public verify page at `/visit/:token` - scans once, shows checkin confirmation with vaccine/temperament/zone status
  - Members endpoint scoped to institute (via checkin_records join) — no global pet-owner exposure
  - UI pages: VisitSessionManager (QR issuance), ZoneManagement (zone CRUD), VisitVerifyPage (public scan page)
  - Sidebar integration: 방문 신뢰 QR + 구역 관리 for institute-admin, 방문 신뢰 QR for trainer
  - Routes: `/institute/visit-sessions`, `/institute/zone-management`, `/visit/:token`
- **QR 체크인 CRM 시스템 (Apr 12)**:
  - New `institute_qr_codes` table for QR code management per institute
  - New `checkin_records` table for visitor checkin tracking
  - API endpoints: POST/GET/PUT/DELETE `/api/institute/qr-codes`, GET `/api/checkin/qr/:token` (public), POST `/api/checkin` (public), GET `/api/institute/checkins`, GET `/api/institute/checkins/history/:ownerId`, GET `/api/institute/checkins/stats`
  - Role-based access: institute-admin creates/manages QR codes, trainer/institute-admin views checkins, public checkin page for visitors
  - Public checkin page at `/checkin/:token` - mobile-optimized, works for both logged-in and guest visitors
  - QR management page, checkin dashboard with stats, customer history with visit timeline
  - Sidebar integration: QR 관리 + 체크인 현황 for institute-admin, 체크인 현황 for trainer
  - Routes: `/institute/qr-codes`, `/institute/checkin-dashboard`, `/institute/customer-history/:ownerId`, `/checkin/:token`
- **First Visit Consultation Records + Temperament Grading (Apr 12)**:
  - New `consultation_records` table for first-visit pet consultation documentation
  - API endpoints: Full CRUD - POST/GET/PUT/DELETE `/api/consultation-records`, GET `/api/consultation-records/:id`, GET `/api/consultation-records/pet/:petId`, PUT `/api/pets/:petId/temperament`, GET `/api/pets/all-owners`
  - Role-based access with IDOR protection: trainers own-records only, institute-admins scoped to their institute, admins unrestricted; pet-owners read-only for their own pets
  - Temperament grading system: A (사회성 양호), B (흥분 조절), C (짖음/경계), D (공격성 주의), E (분리불안)
  - UI pages: ConsultationRecords (list), ConsultationForm (create), ConsultationDetail (view)
  - Pet profile integration: temperament badge on my-pets cards and pet-detail page, consultation history tab in pet-detail
  - Sidebar menu integration for all roles (trainer, institute-admin, pet-owner)
  - Routes: `/consultation-records`, `/consultation-records/new`, `/consultation-records/:id`

## Recent Changes (January 2026)
- **Home Screen UX Improvement (Jan 19)**: 
  - Added role-specific Quick Action section in Home.tsx renderDefaultHome function
  - Quick actions positioned below hero banner and above statistics section
  - Responsive grid layout: 2 columns on mobile (grid-cols-2), 4 columns on desktop (lg:grid-cols-4)
  - Role-specific action buttons with icons and descriptions:
    - Pet Owner: 내 반려동물 관리, 강의 둘러보기, 예방접종 관리, 시설 찾기
    - Trainer: 내 강의 관리, 수강생 확인, 수익 현황, 일정 관리
    - Institute Admin: 소속 훈련사, 등록 강의, 수익 현황, 설정
    - Not Logged In: 회원가입, 서비스 소개, 무료 체험
  - Card design with colored icon backgrounds, hover effects (scale-105, shadow-lg)
  - All text in Korean
- **Codebase Cleanup (Jan 19)**: 
  - Removed 25+ duplicate page files (auth variants, unused admin pages, etc.)
  - Consolidated routes: /admin/points (unified), /admin/commission (deduplicated)
  - Removed 29 unused components (76 → 47 components)
  - Total tsx files reduced from ~500 to 457
  - Removed all backup files (.bak, .backup)
- **AI Services**: Using OpenAI GPT-4.1 exclusively for all AI features
- **Simplified Registration with Admin Approval**: Streamlined registration to require only 4 fields (email, password, name, role). New users are created with 'pending' approval status and require admin approval before login. Social login users are auto-approved.
- **Admin Approval APIs**: Added endpoints for managing user approvals:
  - GET /api/admin/users/pending - List pending users
  - POST /api/admin/users/:id/approve - Approve a user
  - POST /api/admin/users/:id/reject - Reject a user with reason
- **Database Schema Update**: Added approval_status, approved_at, approved_by, rejection_reason columns to users table.
- **Authentication Flow**: Login now validates approval status; pending/rejected users receive informative error messages.

## Known Issues - Database Schema Duplicates (Migration Required)
The following duplicate fields exist in the users table and require future migration:
- `phone` vs `phoneNumber` → standardize to `phone`
- `avatar` vs `profileImage` → standardize to `profileImage`
- `name` vs `fullName` → standardize to `name`
- `verified` vs `isVerified` vs `emailVerified` → standardize to `emailVerified`
- `subscriptionTier` vs `membershipTier` → standardize to `membershipTier`
Note: Migration should be done carefully to avoid data loss.

## Previous Changes (December 2025)
- **Routing Fix**: Fixed trainer dashboard routes (/trainer/courses, /trainer/notebook, etc.) returning 404 errors. The issue was caused by AppLayout having an internal Switch that intercepted all routes before AuthenticatedRoutes could handle them. Solution: Modified AppLayout to render children instead of its own Switch.
- **Trainer Registration**: Enhanced trainer registration to auto-assign to "TALEZ 공식 기관" (default institute) when no institute code is provided.
- **Login Security**: Added CSRF token handling to login API endpoint.

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
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **WebRTC**: simple-peer
- **Real-time Communication**: Socket.IO