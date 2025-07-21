# Edu360+ - AI-Powered School Safety & Mental Wellness Platform

## Overview

Edu360+ is a comprehensive mental wellness and school safety platform designed for educational institutions. The application provides mood tracking, anonymous reporting, emergency response, and AI-powered wellness support for students, teachers, parents, counselors, and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend with TypeScript and Vite as the build tool. The UI is built with shadcn/ui components and Tailwind CSS for styling, following a mobile-first responsive design approach.

**Key Frontend Decisions:**
- **React + TypeScript**: Chosen for type safety and component-based architecture
- **Vite**: Selected for fast development builds and hot module replacement
- **shadcn/ui + Tailwind CSS**: Provides consistent, accessible UI components with utility-first styling
- **Wouter**: Lightweight routing library for client-side navigation
- **TanStack Query**: Handles server state management and caching

### Backend Architecture
The backend is built with Express.js and uses a PostgreSQL database with Drizzle ORM for type-safe database operations.

**Key Backend Decisions:**
- **Express.js**: Familiar Node.js framework for REST API development
- **PostgreSQL**: Relational database chosen for data integrity and complex queries
- **Drizzle ORM**: Type-safe ORM that generates TypeScript types from schema
- **Neon Database**: Serverless PostgreSQL provider for scalable hosting

### Authentication System
The application implements a custom authentication system with role-based access control.

**Authentication Approach:**
- Custom auth implementation using bcrypt for password hashing
- Role-based access (student, teacher, parent, counselor, admin)
- Session-based authentication with localStorage persistence
- Client-side auth state management through React Context

## Key Components

### Core Features
1. **Mood Check-ins**: Daily emotional wellness tracking with AI analysis
2. **Anonymous Reporting**: Secure incident reporting system with file attachments
3. **Emergency Panic Button**: Location-aware emergency alert system
4. **AI Chat**: Wellness support chatbot with resource recommendations
5. **Counselor Dashboard**: Case management and student monitoring tools
6. **Parent Portal**: Child wellness monitoring and notifications
7. **Admin Console**: System-wide analytics and user management

### Database Schema
The database uses PostgreSQL with the following core entities:
- **users**: Multi-role user accounts with hierarchical relationships
- **mood_checkins**: Daily mood tracking with AI analysis data
- **anonymous_reports**: Incident reporting with status tracking
- **panic_alerts**: Emergency notifications with location data
- **wellness_cases**: Counselor case management
- **counselor_notes**: Session notes and student interactions
- **chat_messages**: AI chat conversation history
- **parent_notifications**: Parent alert system

### AI Integration
OpenAI API integration provides:
- Mood journal analysis and sentiment detection
- Risk assessment and intervention recommendations
- Conversational wellness support
- Resource suggestions based on user needs

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates against database using bcrypt
3. User object (without password) returned to client
4. Auth state stored in localStorage and React Context
5. Protected routes check auth state before rendering

### Mood Check-in Flow
1. Student selects mood level and energy rating
2. Optional journal entry submitted
3. Server processes entry through OpenAI API for analysis
4. Results stored with flagging for counselor attention
5. Real-time updates trigger parent notifications if needed

### Emergency Alert Flow
1. User activates panic button
2. Geolocation captured if permitted
3. Alert immediately stored in database
4. Real-time notifications sent to counselors/admins
5. Emergency contact procedures activated

### Real-time Updates
The application implements real-time features using:
- Custom realtime context for managing subscriptions
- Simulated real-time updates through query invalidation
- Toast notifications for urgent alerts
- Automatic UI updates when new data arrives

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database connection
- **openai**: AI analysis and chat functionality
- **bcryptjs**: Password hashing and authentication
- **wouter**: Client-side routing
- **react-hook-form**: Form state management with validation

### UI Dependencies
- **@radix-ui/***: Accessible headless UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **class-variance-authority**: Type-safe variant management
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **eslint**: Code linting and formatting
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development Environment
- **Replit**: Primary development environment with AI assistance
- **Vite Dev Server**: Hot module replacement for fast iteration
- **Local PostgreSQL**: Database development using Neon serverless

### Production Considerations
The application is structured for deployment to:
- **Frontend**: Vercel or Netlify for static hosting
- **Backend**: Railway, Render, or similar Node.js hosting
- **Database**: Neon, Supabase, or managed PostgreSQL
- **AI Services**: OpenAI API with proper rate limiting

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `NODE_ENV`: Environment designation (development/production)

### Security Considerations
- Password hashing with bcrypt (12 rounds)
- Input validation using Zod schemas
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Environment variable protection for sensitive keys