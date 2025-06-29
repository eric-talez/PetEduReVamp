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