# TALEZ - Pet Education & E-commerce Platform

## Overview

TALEZ is a comprehensive pet education and e-commerce platform that combines AI-powered pet training services with an online shopping experience for pet supplies. The platform serves multiple user types including pet owners, professional trainers, and educational institutions, providing personalized training programs and convenient access to pet-related products.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Components**: Radix UI for accessible, headless components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React hooks and context for local state
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server
- **Development**: tsx for TypeScript execution without compilation
- **Session Management**: Express session with configurable store
- **Authentication**: Custom authentication system with social login support (Kakao, Naver, Google)
- **API Integration**: OpenAI for AI features, Stripe for payments

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (production), configured via DATABASE_URL
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless for cloud database connectivity

## Key Components

### Authentication System
- **Multi-provider Support**: Native login, Kakao, Naver, Google OAuth
- **Session Management**: Configurable session store with secure cookie handling
- **Role-based Access**: Support for different user roles (pet-owner, trainer, admin)
- **Verification System**: Identity verification with CI (Certification Identifier) support

### E-commerce Platform
- **Product Management**: Comprehensive product catalog with categories, images, pricing
- **Shopping Cart**: Session-based cart management with item persistence
- **Payment Processing**: Stripe integration for secure transactions
- **Order Management**: Complete order lifecycle from cart to fulfillment

### Educational Services
- **Course Management**: Training courses with enrollment and progress tracking
- **Trainer Profiles**: Professional trainer directory with specializations
- **Pet Profiles**: Individual pet information and training history
- **AI-powered Recommendations**: Personalized training suggestions

### Communication Features
- **Email Services**: SendGrid integration for transactional emails
- **Real-time Chat**: Customer support and trainer communication
- **Notifications**: In-app and email notification system

## Data Flow

### User Authentication Flow
1. User initiates login (native or social)
2. Authentication service validates credentials
3. Session created with user data and permissions
4. Frontend receives authentication state
5. Protected routes accessible based on user role

### E-commerce Flow
1. User browses products with filtering and search
2. Products added to session-based cart
3. Checkout process with Stripe payment
4. Order confirmation and email notification
5. Order tracking and fulfillment

### Educational Service Flow
1. User registers for courses or trainer sessions
2. AI analyzes pet profile for recommendations
3. Progress tracking and feedback collection
4. Certification and completion tracking

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon serverless
- **Email**: SendGrid for transactional emails
- **Payments**: Stripe for payment processing
- **Maps**: Kakao Maps API for location services

### AI and Analytics
- **AI Services**: OpenAI for intelligent features
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Authentication**: Social login providers (Kakao, Naver, Google)

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Testing**: Jest for unit and integration testing

## Deployment Strategy

### Development Environment
- **Runtime**: tsx for TypeScript execution
- **Database**: Local PostgreSQL or cloud development instance
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend

### Production Deployment
- **Containerization**: Docker with multi-stage builds
- **Process Management**: PM2 for production process management
- **Reverse Proxy**: Nginx for load balancing and SSL termination
- **Environment Configuration**: Comprehensive environment variables for all services

### Infrastructure Options
- **Docker Compose**: Complete local development stack
- **Cloud Deployment**: Configured for various cloud providers
- **CDN**: Static asset delivery optimization
- **SSL**: Let's Encrypt integration for HTTPS

## Changelog

- July 03, 2025. Enhanced community post creation with link preview functionality:
  - Added link information input section that appears after post creation failures
  - Implemented automatic link metadata extraction with title, description, and thumbnail
  - Created link preview card component showing extracted information
  - Added manual link editing capabilities for title, description, and image URL
  - Integrated thumbnail image display with error handling and removal options
  - Built comprehensive link validation and error handling system
  - Enhanced post creation workflow with optional link attachment feature
  - Added toggle button for voluntary link addition during post creation
  - Server-side API endpoint for link metadata extraction with URL validation
- July 01, 2025. Implemented automatic subtitle generation for video lecture system:
  - Added OpenAI Whisper API integration for automatic speech-to-text conversion
  - Created AutoSubtitleManager component with drag-and-drop file upload interface
  - Implemented both audio and video file processing with FFmpeg integration
  - Added SRT and WebVTT subtitle format generation and download functionality
  - Enhanced VideoPlayer component with automatic subtitle management features
  - Integrated subtitle toggle button with visual indicators for subtitle availability
  - Added real-time subtitle generation progress tracking with user feedback
  - Supports Korean language optimization with accurate transcription results
  - Created seamless workflow from file upload to subtitle integration in video player
- July 01, 2025. Enhanced button color contrast and accessibility in expert finder section:
  - Improved TALEZ certification button with proper color contrast using CSS variable system
  - Enhanced search button visibility with explicit primary colors and proper aria-labels
  - Updated filter buttons with consistent color contrast using utility classes
  - Improved "Profile View" buttons with better border contrast and hover states
  - Enhanced banner text readability with higher opacity backgrounds and shadow effects
  - Applied consistent transition animations and font weights across all interactive elements
  - All buttons now meet WCAG accessibility standards for color contrast ratios
- July 01, 2025. Successfully implemented realistic service operation data connections between pet owners and trainers:
  - Created comprehensive pet owner database with 3 representative users (김지영, 박민호, 이수진)
  - Added 3 realistic pet profiles (맥스-골든리트리버, 루나-보더콜리, 초코-프렌치불독) with detailed characteristics
  - Established actual service connections with trainer-pet owner messaging system
  - Implemented real-time communication between pet owners and professional trainers
  - Server successfully running with authentic data flow: 5 trainers, 5 users, 3 pets, 2 active messages
  - Created foundation for realistic service demonstration and user experience testing
  - System now operates like a live platform with actual trainer-pet owner interactions
- July 01, 2025. Completed comprehensive banner image replacement with fresh dog-focused training content (23 total banners):
  - Replaced all 8 home page banner slides with completely new dog training and education imagery
  - Updated all 15 trainer-specific banner slides with fresh professional dog training scenarios
  - Total of 23 banner images replaced with visually distinct, high-quality dog training content
  - Implemented visual variety while maintaining cohesive dog training theme across entire platform
  - New images showcase: experience service, location finder, video training, health management, shopping, community, institute registration, and trainer-specific motivational content
  - All banner images now feature modern, professional dog training and pet education scenarios
  - Enhanced visual consistency and freshness across both homepage and trainer dashboard
  - Fixed "전문가 인증 업그레이드" button text visibility with explicit white color styling
  - Enhanced button contrast and readability across both homepage and dashboard banners
  - Applied consistent font-semibold styling for better visual prominence
- June 30, 2025. Enhanced banner systems across homepage and trainer dashboard:
  - Updated trainer banner messages with refined motivational content focusing on core value propositions
  - Key banner messages now include: "더 많은 반려인들이 당신을 찾고 있습니다", "전문 훈련사의 가치를 제대로 인정받으세요", "온라인과 오프라인을 넘나드는 새로운 교육 경험", "훈련사 커뮤니티에서 노하우를 공유하고 성장하세요", "반려견 교육의 미래를 함께 만들어갑니다"
  - Synchronized banner content between homepage and trainer dashboard for consistent messaging
  - Added role-based banner selection logic (trainer banners only show for authenticated trainers)
  - Modified home page routing so trainers see main homepage with special banners instead of being redirected to TrainerHome
  - Made banner selection reactive using useMemo to properly update when authentication state changes
  - Increased banner height by 30% from 168px to 218px for better visual impact
  - Added comprehensive banner slider system to trainer dashboard with 5 specialized slides
  - Implemented auto-rotation every 5 seconds with manual navigation controls (arrows and dot indicators)
  - Enhanced trainer experience with personalized branding and growth-focused messaging across multiple touchpoints
- June 30, 2025. Set service status section to collapsed by default on main homepage:
  - Modified Home.tsx to set isServiceStatsOpen state to false by default
  - Service status section now appears collapsed when users first visit the homepage
  - Users can still expand the section by clicking the toggle button
- June 30, 2025. Enhanced user accessibility and authentication features:
  - Added location finder menu visibility for non-logged-in users in sidebar navigation
  - Created quick login buttons in main authentication page (login.tsx) with test accounts
  - Implemented one-click credential filling for different user roles (test, trainer, admin, institute)
  - Enhanced sidebar navigation with location finder access for all users without authentication
  - Added intuitive quick login interface with grid layout and clear account type selection
  - Fixed routing to ensure quick login buttons appear on the correct login page component
- June 30, 2025. Fixed TypeScript compilation errors and updated database schema:
  - Added missing database columns to users table (subscriptionTier, referralCode, aiUsage, points, fullName)
  - Created additional database tables (projects, proposals, reviews, messages, files, pointTransactions, forums)
  - Fixed JSX syntax errors in course index component
  - Updated Badge component variants from "destructive" to "danger"
  - Resolved SimpleMap component useEffect structure issues
  - Created type definitions for session data and user interfaces
  - Removed corrupted backup files causing compilation errors
  - Positioned TALEZ experience service section above real-time chart on homepage
- June 30, 2025. Integrated TALEZ Experience Service directly into homepage:
  - Added complete video upload and AI analysis experience on main homepage
  - Implemented step-by-step progress indicator (upload → analyzing → results)
  - Created intuitive drag-and-drop file upload interface with validation
  - Added real-time analysis progress with loading animations
  - Integrated comprehensive result display with recommendations
  - Built seamless flow from analysis to expert consultation signup
  - Enhanced with prominent gradient banner and call-to-action button
  - Maintained all security features (file type/size validation, error handling)
  - Optimized for mobile and desktop responsive design
- June 29, 2025. Added TALEZ Experience Service for pre-registration AI video analysis:
  - Implemented Google Generative AI video analysis for dog behavior assessment
  - Created comprehensive experience flow: upload → AI analysis → expert consultation
  - Added pre-registration trial service accessible without account creation
  - Built progressive web interface with step-by-step guided experience
  - Integrated fallback analysis system for service reliability
  - Added expert consultation booking with contact information collection
  - Enhanced homepage with prominent call-to-action for experience service
  - Implemented file upload validation (MP4, AVI, MOV, 50MB limit)
  - Added detailed analysis reporting with recommendations and next steps
- June 27, 2025. Enhanced TALEZ certification system with improved visual design:
  - Upgraded TalezCertificationBadge component with premium gradient styling and animations
  - Added rounded badge design with enhanced shadows and ring effects for verified status
  - Implemented TalezTrainerCertificationBadge for trainer-specific certification display
  - Extended certification system to all trainer and business listing pages
  - Added comprehensive trainer API with certification data including license numbers and levels
  - Unified certification mark design across location finder, trainer search, and my trainers pages
- June 27, 2025. Integrated Naver map service and restored reservation functionality:
  - Replaced Leaflet.js with Naver Maps API for improved map rendering
  - Added comprehensive reservation system with QuickReservationDialog component
  - Implemented location-based reservation booking for hospitals, training centers, and veterinary clinics
  - Enhanced location finder with dual map/list view functionality
  - Added support for multiple location types (hospital, training, grooming, hotel, cafe, park, training-center, pet-store, veterinary, event)
  - Environment variable support for VITE_NAVER_MAP_CLIENT_ID
- June 26, 2025. Updated color scheme to match Figma design specifications:
  - Primary: #2BAA61 (HSL 142 61% 42%)
  - Secondary: #FFA726 (HSL 36 100% 58%)
  - Information: #29B5F6 (HSL 198 86% 58%)
  - Danger: #E74D3C (HSL 4 78% 56%)
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.