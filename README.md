# Autoplaystudio - Collaborative Design Platform

A professional design collaboration platform built with Next.js and Supabase, featuring AI-powered workflow automation and real-time collaboration.

## 🚀 Features

- **Multi-role Dashboard System** (Studio Admin, Client Admin, Client Member, Guest)
- **Real-time Chat & Collaboration** with Supabase Realtime
- **AI-Powered Copilot** for workflow automation
- **Figma Integration** with live iframe embedding
- **Project & Asset Management**
- **Role-based Access Control**
- **Real-time Notifications**
- **Heuristic UI Engine** for personalized interfaces

## 🏗️ Architecture

### Monorepo Structure
```
autoplaystudio/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── db/                  # Database utilities
└── supabase/
    └── functions/           # Edge Functions
```

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API
- **Design Tools**: Figma API
- **Deployment**: Vercel + Supabase

## 🛠️ Development Setup

1. **Clone and Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Fill in your Supabase and other API keys
   ```

4. **Start Supabase**
   ```bash
   npx supabase start
   ```

5. **Run Development Server**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

### Apps/Web Directory
```
apps/web/
├── app/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── studio/         # Studio admin dashboard
│   │   ├── client/         # Client dashboard
│   │   └── project/[id]/   # Project-specific pages
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # App-specific components
├── lib/                    # App utilities
└── middleware.ts           # Auth middleware
```

### Database Schema
Based on your existing Supabase schema with tables for:
- `users` - User profiles and authentication
- `clients` - Client organizations
- `projects` - Project management
- `milestones` - Project milestones and tasks
- `messages` - Real-time chat system
- `notifications` - User notifications
- `media` - Asset management

## 🔐 Authentication & Authorization

- **Supabase Auth** for user management
- **Row Level Security (RLS)** for data protection
- **Role-based access control** with middleware
- **JWT token validation** for API security

## 🔄 Real-time Features

- **Chat System**: Project-level and direct messaging
- **Live Cursors**: Real-time collaboration indicators
- **Notifications**: Instant updates for mentions and tasks
- **Presence**: User online/offline status

## 🤖 AI Integration

### Autoplaystudio Copilot
- Workflow automation and suggestions
- UI personalization based on user behavior
- Integration with Figma for design modifications
- Natural language interface for project management

### Heuristic UI Engine
- Dynamic interface adaptation per user role
- Contextual component visibility
- Personalized dashboard layouts
- Behavioral learning algorithms

## 🎨 Design System

### UI Components (packages/ui)
- Consistent design tokens
- Accessible component library
- Responsive design patterns
- Dark/light theme support

### Styling Guidelines
- Tailwind CSS utility classes
- CSS custom properties for theming
- Mobile-first responsive design
- Performance-optimized animations

## 🔌 Integrations

### Figma
- OAuth 2.0 authentication
- Live iframe embedding
- Webhook notifications for version updates
- MCP (Model Context Protocol) for AI interactions

### OpenAI
- GPT integration for copilot features
- Intelligent project briefing generation
- Natural language processing for commands

## 🚀 Deployment

### Environment Setup
1. **Production Supabase Project**
2. **Vercel Deployment**
3. **Environment Variables Configuration**
4. **Database Migration**

### CI/CD Pipeline
- Automated testing on PR
- Staging deployment for reviews
- Production deployment on merge
- Database migration automation

## 📊 Monitoring & Analytics

- Error tracking and reporting
- Performance monitoring
- User analytics and insights
- Real-time system health checks

## 🔒 Security

- HTTPS enforcement
- CSRF protection
- XSS prevention
- SQL injection protection via Supabase RLS
- API rate limiting
- Input validation and sanitization

## 📝 License

Proprietary - All rights reserved to Autoplaystudio LLC

## 🤝 Contributing

This is a private project. Development guidelines:
1. Follow TypeScript strict mode
2. Use ESLint and Prettier for code formatting
3. Write tests for critical functionality
4. Document API changes
5. Follow Git conventional commits

---

For questions or support, contact the development team.
