# warpSpeed AI Chat Web Portal

A fully featured web version of the warpSpeed AI Chat experience, providing users with seamless access to their AI partner from a desktop browser. This portal maintains the same context, memory, and personalized behavior as the mobile app, ensuring a consistent experience across all devices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Requirements](#technical-requirements)
- [User Stories](#user-stories)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Configuration](#api-configuration)
- [Authentication](#authentication)
- [Key Components](#key-components)
- [Design Implementation](#design-implementation)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## 🎯 Overview

The **warpSpeed AI Chat Web Portal** is a Next.js-based web application that extends the mobile AI chat experience to desktop browsers. It provides:

- **Secure Authentication**: Email/password, magic link, and OAuth (Google, Apple) support
- **Real-time Sync**: Messages and state stay synchronized with the mobile app
- **Full Context**: AI maintains account-level context and memory across devices
- **Responsive Design**: Optimized for desktop while maintaining mobile compatibility
- **Seamless UX**: Natural extension of the mobile app experience

## ✨ Features

### Authentication & Security
- ✅ Email/password login
- ✅ User registration with email verification
- ✅ OAuth integration (Google, Apple)
- ✅ Magic link authentication
- ✅ Password reset flow
- ✅ Secure token storage and refresh
- ✅ Session timeout handling
- ✅ Protected routes with middleware

### Chat Functionality
- ✅ Create new conversations
- ✅ View full chat history
- ✅ Switch between conversations
- ✅ Real-time message synchronization
- ✅ Markdown rendering for AI responses
- ✅ Message citations and sources
- ✅ Typing indicators
- ✅ Message controls (copy, download, text-to-speech, feedback)
- ✅ Conversation title generation

### User Interface
- ✅ Responsive design (desktop & mobile)
- ✅ Desktop sidebar navigation
- ✅ Mobile bottom sheet modals
- ✅ Profile management
- ✅ Account details modal
- ✅ Logout confirmation
- ✅ Error states with retry options
- ✅ Loading states and skeletons
- ✅ Offline handling

### Design Implementation
- ✅ Pixel-perfect implementation of provided designs
- ✅ Desktop and mobile layouts
- ✅ Custom color system from Colors.ts
- ✅ Tailwind CSS styling
- ✅ Responsive breakpoints
- ✅ Smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Markdown Rendering**: react-markdown with remark-gfm
- **Package Manager**: pnpm 8.0+
- **Node Version**: 18+

## 📁 Project Structure

```
warpspeed-ai-chat-web-portal/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to /chat)
│   ├── loading.tsx              # Global loading component
│   ├── error.tsx                # Global error boundary
│   ├── login/                  # Login page
│   │   └── page.tsx
│   ├── register/               # Registration flow
│   │   ├── page.tsx            # Registration step 1
│   │   ├── info/               # Registration step 2
│   │   └── verify/             # Email verification
│   ├── forgot-password/        # Password reset
│   ├── chat/                   # Chat interface
│   │   ├── page.tsx            # New conversation
│   │   └── [conversationId]/   # Specific conversation
│   ├── profile/                # User profile
│   │   └── edit/               # Edit profile (mobile)
│   └── auth/                   # OAuth callbacks
│       └── callback/
│           └── page.tsx
├── src/
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   ├── login-preview-panel.tsx
│   │   │   └── register-form-new.tsx
│   │   ├── chat/               # Chat-specific components
│   │   │   ├── chat-layout.tsx
│   │   │   ├── conversation-sidebar.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── message-bubble-controls.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-entry.tsx
│   │   │   ├── profile-modal.tsx
│   │   │   ├── account-details-modal.tsx
│   │   │   └── logout-modal.tsx
│   │   └── ui/                 # Reusable UI components
│   │       └── loading.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-session.ts      # Session management
│   │   └── api/                # API hooks (React Query)
│   │       ├── use-auth.ts
│   │       └── use-chat.ts
│   ├── lib/                     # Utilities and API clients
│   │   ├── api/                 # API client functions
│   │   │   ├── base.ts          # Axios setup
│   │   │   ├── auth.ts          # Auth API
│   │   │   └── chat.ts         # Chat API
│   │   └── utils/               # Utility functions
│   │       ├── storage.ts       # Token storage
│   │       ├── errors.ts        # Error handling
│   │       └── cn.ts            # Class name utility
│   ├── providers/               # React context providers
│   │   └── query-provider.tsx   # React Query provider
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── chat.ts
│   ├── constants/              # Constants and configuration
│   │   └── Colors.ts           # Color system
│   └── styles/                  # Global styles
│       └── globals.css
├── assets/                      # Static assets
│   └── images/                 # Images and icons
├── middleware.ts                # Next.js middleware for route protection
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── .env.local                  # Environment variables (not in git)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8.0+
- An account on warpSpeed app with access to `api.iamwarpspeed.com`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd warpspeed-ai-chat-web-portal
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
   NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
   
   # OAuth Redirect URL
   # For development:
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
   # For production, update to:
   # NEXT_PUBLIC_OAUTH_REDIRECT_URL=https://app.iamwarpspeed.com
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🔌 API Configuration

The application connects to the warpSpeed API at `https://api.iamwarpspeed.com`. The API specification is available in `api.json`.

### API Endpoints

#### Authentication
- `POST /auth/login` - Email/password authentication
- `POST /auth/register` - User registration
- `GET /auth/user` - Get current user (validates token)
- `GET /auth/user/google` - Initiate Google OAuth
- `GET /auth/user/apple` - Initiate Apple OAuth
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Chat
- `POST /ai-chat/message` - Send a message
- `GET /ai-chat/conversations` - List conversations
- `GET /ai-chat/conversations/{id}/messages` - Get conversation messages
- `GET /query/suggestions` - Get chat suggestions

### API Client Configuration

The API client is configured in `src/lib/api/base.ts`:
- Base URL: `https://api.iamwarpspeed.com`
- Timeout: 40s (standard), 120s (chat messages), 300s (uploads)
- Authentication: Bearer token in `Authorization` header
- Automatic token injection via request interceptors

## 🔐 Authentication

### Authentication Flow

1. **Email/Password Login:**
   - User enters email and password
   - Token stored in HTTP-only cookies and localStorage
   - Automatic redirect to `/chat` on success

2. **OAuth Flow:**
   - User clicks "Continue with Google/Apple"
   - Redirected to OAuth provider
   - Callback handled at `/auth/callback`
   - Token extracted and stored
   - User redirected to `/chat`

3. **Session Management:**
   - Token validated on each API request
   - Automatic refresh on expiration
   - Logout clears all tokens and redirects to login

### Protected Routes

Routes are protected via Next.js middleware (`middleware.ts`):
- Public routes: `/login`, `/register`, `/forgot-password`, `/auth/callback`
- Protected routes: All other routes require authentication
- Automatic redirects based on auth state

## 🧩 Key Components

### Chat Components

- **`ChatLayout`**: Main chat container with sidebar and message area
- **`ConversationSidebar`**: Left sidebar with navigation and chat history
- **`MessageList`**: Scrollable list of messages
- **`MessageBubble`**: Individual message display with markdown rendering
- **`MessageBubbleControls`**: Interactive controls (copy, download, TTS, feedback)
- **`ChatInput`**: Message input with attachment support
- **`ChatEntry`**: Empty state with suggestions

### Authentication Components

- **`LoginForm`**: Email/password login form
- **`LoginPreviewPanel`**: Desktop preview panel with AI chat preview
- **`RegisterFormNew`**: Multi-step registration form

### Modal Components

- **`ProfileModal`**: Desktop profile management modal
- **`AccountDetailsModal`**: Mobile account details bottom sheet
- **`LogoutModal`**: Logout confirmation modal



## 💻 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with configuration in `.prettierrc`
- **Linting**: ESLint with Next.js config
- **Naming**: PascalCase for components, camelCase for functions/variables

### Best Practices

1. **Use Tailwind CSS** for all styling (avoid inline styles)
2. **Use TypeScript** for type safety
3. **Use React Query** for server state management
4. **Follow Next.js App Router** patterns
5. **Reuse color constants** from `Colors.ts` via Tailwind config
6. **Handle errors gracefully** with user-friendly messages
7. **Implement loading states** for all async operations
8. **Ensure accessibility** with proper ARIA labels

### Running Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint

# Formatting
pnpm format
```

## 🚢 Deployment

### Environment Variables for Production

Update `.env.local` for production:

```env
NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
NEXT_PUBLIC_OAUTH_REDIRECT_URL=https://app.iamwarpspeed.com
```

### Build and Deploy

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Deploy** to your hosting platform (Vercel, Netlify, etc.)

3. **Set environment variables** in your hosting platform's dashboard

4. **Verify** OAuth redirect URLs are correctly configured

### Production Checklist

- ✅ Environment variables set
- ✅ OAuth redirect URLs configured
- ✅ API endpoints accessible
- ✅ HTTPS enabled
- ✅ Error tracking configured (if applicable)
- ✅ Analytics configured (if applicable)

## 📝 Additional Resources

- **API Documentation**: See `api.json` for OpenAPI specification
- **Design Files**: Refer to provided Adobe XD designs
- **Color System**: See `src/constants/Colors.ts`
- **Component Documentation**: See individual component files

## 🤝 Contributing

This project follows the warpSpeed design system and API specifications. When contributing:

1. Follow the existing code structure
2. Maintain design compliance
3. Use TypeScript for all new code
4. Write clear commit messages
5. Test on both desktop and mobile views



---

**Built with ❤️ for warpSpeed**
