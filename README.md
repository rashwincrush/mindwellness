# Edu360+ - AI-Powered School Safety & Mental Wellness Platform

A comprehensive mental wellness and school safety platform designed for educational institutions. The application provides mood tracking, anonymous reporting, emergency response, and AI-powered wellness support for students, teachers, parents, counselors, and administrators.

## 🚀 Quick Start

### Demo Users (Password: `password123` for all)

- **Admin**: `admin@edu360.com` - Full system access and analytics
- **Counselor**: `counselor@edu360.com` - Case management and student support
- **Parent**: `parent@edu360.com` - Child wellness monitoring
- **Student**: `student@edu360.com` - Mood tracking and wellness tools
- **Teacher**: `teacher@edu360.com` - Student support and reporting

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Vite** for fast development builds
- **Tailwind CSS** + **shadcn/ui** for consistent design system
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing

### Backend (Node.js + Express)
- **Express.js** REST API with TypeScript
- **In-memory storage** for development (easily replaceable with database)
- **Role-based authentication** with bcrypt password hashing
- **Real-time notifications** framework (WebSocket-ready)

### Key Features
1. **Mood Check-ins**: Daily emotional wellness tracking with AI analysis placeholders
2. **Anonymous Reporting**: Secure incident reporting with file attachment support
3. **Emergency Panic Button**: Location-aware emergency alert system
4. **AI Chat Support**: Wellness chatbot framework (OpenAI integration ready)
5. **Counselor Dashboard**: Case management and student monitoring tools
6. **Parent Portal**: Child wellness monitoring and real-time notifications
7. **Admin Console**: System-wide analytics and user management

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- Modern web browser

### Local Development
1. **Clone or open in Replit**:
   ```bash
   git clone [your-repo]
   cd edu360-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open browser to `http://localhost:5000`
   - Use demo credentials above to test different roles

## 📁 Project Structure

```
├── client/src/
│   ├── components/          # Reusable UI components
│   │   ├── MoodCheckin.tsx
│   │   ├── AnonymousReport.tsx
│   │   ├── EmergencyPanic.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Route components
│   │   ├── StudentDashboard.tsx
│   │   ├── CounselorDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ParentDashboard.tsx
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── RealtimeContext.tsx
│   └── lib/               # Utility functions
│       ├── queryClient.ts
│       └── supabase.ts   # Auth and realtime management
├── server/                # Backend API
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data persistence layer
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── README.md
```

## 🔐 Role-Based Access

### Student/Teacher
- Daily mood check-ins with optional journal entries
- Anonymous reporting system for safety concerns
- AI wellness chat support (placeholder)
- Emergency panic button with location sharing

### Parent
- Monitor child's wellness trends
- Receive notifications about concerning patterns
- View school communication and alerts

### Counselor
- Manage student wellness cases
- Review flagged mood patterns and reports
- Document session notes and interventions
- Real-time emergency alert notifications

### Administrator
- System-wide analytics and reporting
- User management and role assignments
- Emergency response coordination
- Platform health monitoring

## 🌐 Deployment Strategy

### Development Phase (Current)
- **Development**: Replit for AI-assisted coding
- **Version Control**: GitHub repository
- **Frontend Deployment**: Ready for Vercel
- **Backend Deployment**: Ready for Railway/Render

### Production Readiness
The platform is structured for easy deployment:

1. **Frontend**: Deploy to Vercel via GitHub integration
2. **Backend**: Deploy to Railway, Render, or similar Node.js hosting
3. **Database**: Ready for Supabase, Neon, or PostgreSQL migration
4. **Real-time**: WebSocket integration prepared

## 🔮 Planned Integrations

### AI & Analysis (Placeholder Implementation)
- **OpenAI GPT-4** for mood journal analysis
- **Sentiment analysis** for risk assessment
- **Wellness recommendations** based on patterns
- **Crisis intervention** triggers

### Emergency Communications (Framework Ready)
- **Twilio SMS** for emergency alerts
- **Email notifications** for non-urgent communications
- **Push notifications** for mobile apps
- **WhatsApp Business API** for parent communication

### Location & Safety (Prepared)
- **GPS location sharing** during emergencies
- **Google Maps integration** for incident reporting
- **Geofencing** for school premises monitoring

## 🚨 Security Features

- **Password hashing** with bcrypt (12 rounds)
- **Role-based access control** for all endpoints
- **Input validation** using Zod schemas
- **SQL injection prevention** through parameterized queries
- **CORS protection** for cross-origin requests
- **Environment variable protection** for sensitive keys

## 📊 Sample Data

The platform includes comprehensive sample data for testing:

- **5 user accounts** across all roles
- **Mock mood check-ins** with AI analysis results
- **Sample anonymous reports** with various priority levels
- **Wellness cases** with counselor notes
- **Parent notifications** for different scenarios

## 🧪 Testing Different Roles

1. **Log in as Admin** to see system overview and analytics
2. **Switch to Counselor** to review cases and flagged students
3. **Try Parent account** to monitor child wellness
4. **Use Student login** to submit mood check-ins and reports
5. **Test Teacher role** for classroom wellness monitoring

## 🚀 Next Steps

1. **Connect External APIs**:
   - Add OpenAI API key for real AI analysis
   - Configure Twilio for SMS emergency alerts
   - Integrate Google Maps for location services

2. **Database Migration**:
   - Set up Supabase project
   - Run schema migration
   - Configure Row Level Security (RLS)

3. **Production Deployment**:
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Configure environment variables

4. **Enhanced Features**:
   - Mobile app development
   - Advanced analytics dashboard
   - Integration with school information systems

## 📞 Support

For development questions or technical support, refer to the comprehensive documentation in `replit.md` or contact the development team.

---

**Built with ❤️ for student mental wellness and safety**