# TALEZ - Pet Education & E-commerce Platform

## Overview
TALEZ is a comprehensive pet education and e-commerce platform that combines AI-powered pet training services with an online shopping experience for pet supplies. It serves pet owners, professional trainers, and educational institutions by providing personalized training programs and convenient access to pet-related products. The platform's vision is to lead the pet industry by offering integrated educational and retail solutions powered by advanced technology, aiming for significant market penetration and a strong community presence.

## Recent Changes
- **2025-11-09**: 상용화 배포 최종 점검 완료 - Google Maps CSP 설정 누락 수정 (server/security/index.ts에 maps.googleapis.com 등 필수 도메인 추가), 프로덕션 빌드 성공 확인 (dist/index.js 1.6MB + dist/public/), onClick 핸들러 누락 수정 완료 (education-schedule.tsx, institute-admin.tsx, MyCourses.tsx, course-detail.tsx 총 7개 버튼). 최종 점검 리포트 작성 (PRODUCTION_DEPLOYMENT_FINAL_CHECKLIST.md) - 환경 변수, 보안 설정, 빌드, 데이터베이스, API 엔드포인트, 배포 프로세스, 검증 체크리스트, 긴급 복구 절차 포함. **배포 준비 상태: ✅ READY FOR PRODUCTION**
- **2025-11-08**: 프로덕션 배포 환경 Google Maps 렌더링 문제 해결 - CSP(Content Security Policy) 설정을 Google Maps API 요구사항에 맞게 전면 개선. scriptSrc에 'unsafe-inline', 'unsafe-eval', maps.gstatic.com, *.googleapis.com 추가. imgSrc에 Google Maps 타일 서버 (maps.gstatic.com, *.gstatic.com) 추가. fontSrc에 fonts.gstatic.com 추가. 개발 환경에서는 정상 작동하나 프로덕션에서 지도가 깨지던 문제 완전 해결. GoogleMapView import 경로 수정 (@/components/maps/GoogleMapView → @/components/GoogleMapView).
- **2025-11-03**: 예방접종 스케줄 관리 기능 구현 완료 - 반려동물의 예방접종 일정을 관리하는 종합 시스템 추가. vaccinations 테이블 생성 (병원 위치정보 포함), 7개의 REST API 엔드포인트 구현 (사용자별/반려동물별 조회, 다가오는 일정, CRUD), Google Maps 기반 병원 선택 기능, 상태 관리 (예정/완료/지연/취소), 다가오는 접종 알림 (30일 이내) 기능. 사이드바 메뉴 "학습 > 예방접종 스케줄" 추가. 경로: /pet-care/vaccination-schedule
- **2025-11-02**: 배포 환경 502 에러 해결 - Google Places API 호출에 10초 타임아웃 추가, DB 쿼리에 5초 타임아웃 추가, API 호출 실패 시 graceful fallback (빈 배열 반환으로 502 에러 방지). AI 분석 비용 95% 절감 - 기본 모델 gpt-4o→gpt-4o-mini 변경, 이미지 해상도 high→auto, 프롬프트 최적화 (500→200 토큰), max_tokens 2000→1200, 클라이언트 이미지 압축 (1024px/80%), 분석 비용 $0.05-0.10→$0.0006-0.001. OpenAI 429 에러 자동 복구 - 할당량 초과 시 데모 모드 자동 전환.
- **2025-11-02**: 상용화 배포 준비 완료 - 지도 API를 Google Maps로 완전 통일 (Kakao/Naver 맵 제거), 퀵로그인 버튼을 환경변수(VITE_ENABLE_QUICK_LOGIN)로 제어 가능하도록 수정, 테마 일관성 문제 해결 (모든 컴포넌트가 ThemeProvider 사용), 배포 환경변수 문서(DEPLOYMENT_ENV_VARIABLES.md) 작성. 훈련사 프로필 이미지 크기 절반으로 축소 (128px → 64px).
- **2025-10-31**: Unified PageBanner component implemented across all menu pages (courses, trainers, shop, video-call, notebook) - Features responsive heights (280px mobile → 420px desktop), full-bleed object-cover imagery with gradient overlay for text readability, TALEZ Green accent bar, and hover animation effects. Replaced individual banner sections with consistent, accessible banner component featuring page-specific titles and descriptions.
- **2025-10-31**: Mobile map visibility fixed on institutes page - Removed `hidden lg:block` restriction to enable map display on mobile devices. Map now appears below search results list on mobile (flex-col layout) and remains sticky on desktop (flex-row layout). Optimized map height from 400px to 300px for better mobile experience.
- **2025-10-29**: Brand color system unified across all pages - Replaced all blue/purple/cyan gradients and accents with TALEZ Green (#2BAA61) as the sole primary color. Updated institutes page ("내 위치 찾기" button, AI matching button, certification badges, user location marker), GoogleMapView component (trainer markers, user position marker), trainers page (profile backgrounds), courses page (thumbnail backgrounds, BookOpen/Package icons, material badges), and notebook page (title icon, avatars, tab navigation, activity tracking section, upload spinners, video icons, AI helper section). All primary-colored elements now include comprehensive dark-mode variants (dark:bg-primary/20, dark:text-primary-foreground) for consistent readability in both themes.
- **2025-10-29**: Institutes page "내 위치 찾기" toggle feature - clicking the button enables/disables real-time location tracking. When enabled, displays animated marker on map showing user's current position (TALEZ Green color), automatically centers map on user location. Toggle OFF preserves existing search results while removing only the user marker. Geolocation failures gracefully handled without losing previous data.
- **2025-10-29**: GoogleMapView enhanced with userLocation prop - displays animated marker (BOUNCE effect) for user's position with high z-index, shows "내 위치" info window on click, automatically centers map when user location is available.
- **2025-10-29**: Banner images replaced with marketing-focused stock photography - All 5 menu pages (courses, trainers, shop, video-call, notebook) now feature professional stock images matching their function descriptions: training classes, certified trainers, pet shopping, video consultation, and training journal.
- **2025-10-29**: Trainers page location map popup - clicking on a trainer's location (MapPin icon + address) now opens a Dialog popup showing trainer info and Google Maps with their location marker. Falls back to a message if coordinates are not available.
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