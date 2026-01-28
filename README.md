# warpSpeed AI Chat Web Portal

A web portal for the warpSpeed AI Chat experience, providing secure desktop access to the AI partner with the same context, memory, and personalized behavior as the mobile app.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Configuration](#api-configuration)
- [Authentication](#authentication)
- [Key Components](#key-components)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## Overview

The warpSpeed AI Chat Web Portal is a Next.js application that extends the mobile AI chat experience to desktop browsers. It provides:

- Secure authentication via email/password and OAuth (Google, Apple)
- User registration with comprehensive validation and automatic login
- Real-time message synchronization with the mobile app
- Full AI context and memory maintained across devices
- Responsive design optimized for desktop and mobile
- Session security with automatic timeout and logout

## Features

### Authentication and Security
- Email/password login
- User registration with field validation (names, email format, password requirements)
- OAuth integration (Google, Apple)
- Password reset flow
- Secure token storage
- Session timeout with warning modal (30 minutes inactivity)
- Automatic logout on session expiration
- Protected routes with middleware

### Chat Functionality
- Create new conversations
- View full chat history
- Switch between conversations
- Real-time message synchronization
- Markdown rendering for AI responses
- Message controls (copy, download, text-to-speech, feedback)
- Typing indicators
- Conversation title generation

### User Interface
- Responsive design (desktop and mobile layouts)
- Desktop sidebar navigation with chat history
- Mobile-optimized bottom sheet modals
- Profile management
- Account details modal
- Logout confirmation
- Error states with retry options
- Loading states

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Markdown Rendering**: react-markdown with remark-gfm
- **Package Manager**: pnpm 8.0+
- **Node Version**: 18+

## Project Structure

```
warpspeed-ai-chat-web-portal/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to /chat)
│   ├── loading.tsx              # Global loading component
│   ├── error.tsx                # Global error boundary
│   ├── login/                   # Login page
│   ├── register/                # Registration flow
│   │   ├── page.tsx
│   │   └── verify/              # Email verification
│   ├── forgot-password/         # Password reset
│   ├── chat/                    # Chat interface
│   │   ├── page.tsx             # New conversation
│   │   └── [conversationId]/    # Specific conversation
│   ├── profile/                 # User profile
│   │   └── edit/
│   └── auth/                    # OAuth callbacks
│       └── callback/
├── src/
│   ├── components/              # React components
│   │   ├── auth/                # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   ├── login-preview-panel.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── session-timeout-modal.tsx
│   │   ├── chat/                # Chat components
│   │   │   ├── chat-layout.tsx
│   │   │   ├── conversation-sidebar.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── message-bubble-controls.tsx
│   │   │   ├── chat-input-base.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-entry.tsx
│   │   │   ├── profile-modal.tsx
│   │   │   ├── account-details-modal.tsx
│   │   │   └── logout-modal.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── loading.tsx
│   │       ├── modal.tsx
│   │       ├── error-boundary.tsx
│   │       └── form/             # Shared form components
│   │           ├── password-input.tsx
│   │           ├── password-requirements.tsx
│   │           ├── social-login-buttons.tsx
│   │           ├── form-error.tsx
│   │           └── form-divider.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-session.ts       # Session management
│   │   ├── use-session-timeout.ts # Inactivity timeout
│   │   ├── use-modal.ts
│   │   ├── use-api-error.ts
│   │   ├── use-chat-input.ts
│   │   ├── index.ts
│   │   └── api/                 # API hooks (React Query)
│   │       ├── use-auth.ts
│   │       └── use-chat.ts
│   ├── lib/                     # Utilities and API clients
│   │   ├── api/                 # API client functions
│   │   │   ├── base.ts          # Axios configuration
│   │   │   ├── auth.ts          # Auth API
│   │   │   └── chat.ts          # Chat API
│   │   ├── validation/          # Shared field validation
│   │   │   ├── email.ts
│   │   │   ├── name.ts
│   │   │   └── password.ts
│   │   └── utils/               # Utility functions
│   │       ├── storage.ts       # Token and session storage
│   │       ├── errors.ts        # Error handling
│   │       ├── accessibility.ts
│   │       └── cn.ts            # Class name utility
│   ├── providers/               # React context providers
│   │   ├── query-provider.tsx   # React Query provider
│   │   ├── session-provider.tsx # Session timeout provider
│   │   └── error-boundary-provider.tsx
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   └── errors.ts
│   ├── constants/               # Constants and configuration
│   │   └── Colors.ts            # Color system
│   └── styles/                  # Global styles
│       └── globals.css
├── assets/                      # Static assets
│   └── images/
├── middleware.ts                # Route protection middleware
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── api.json                     # API specification
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.0+

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd warpspeed-ai-chat-web-portal
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
   NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## API Configuration

The application connects to the warpSpeed API. The full API specification is available in `api.json`.

### Key Endpoints

**Authentication**
- `POST /auth/login` - Email/password authentication
- `POST /auth/register` - User registration
- `POST /auth/logout` - Logout
- `GET /auth/user` - Get current user
- `GET /auth/user/google` - Google OAuth
- `GET /auth/user/apple` - Apple OAuth
- `POST /auth/request-reset-password` - Request password reset
- `PUT /auth/reset-password` - Reset password

**Chat**
- `POST /ai-chat/message` - Send a message
- `GET /ai-chat/conversations` - List conversations
- `GET /ai-chat/conversations/{id}/messages` - Get conversation messages

### API Client

Configured in `src/lib/api/base.ts`:
- Base URL: `https://api.iamwarpspeed.com`
- Timeout: 40s (standard), 300s (uploads)
- Bearer token authentication via request interceptors
- Automatic redirect to login on 401 responses

## Authentication

### Login Flow

1. User enters email and password
2. Token stored in localStorage
3. Automatic redirect to `/chat`

### OAuth Flow

1. User clicks "Continue with Google/Apple"
2. Redirected to OAuth provider
3. Callback handled at `/auth/callback`
4. Token extracted and stored
5. User redirected to `/chat`

### Registration Flow

1. User enters first name, last name, email, and password
2. Form validates all fields with real-time feedback:
   - Names: 2-50 characters, letters only
   - Email: Valid format required
   - Password: Minimum 12 characters, uppercase, lowercase, number, special character
3. On success, user is automatically logged in and redirected to `/chat`

### Session Management

- Token validated on each API request
- 30-minute inactivity timeout
- Warning modal shown 5 minutes before automatic logout
- User can extend session or logout immediately
- Logout clears all tokens and redirects to login

### Protected Routes

Middleware protects all routes except:
- `/login`
- `/register`
- `/forgot-password`
- `/auth/callback`

## Key Components

### Chat Components

- **ChatLayout**: Main container with sidebar and message area
- **ConversationSidebar**: Navigation and chat history
- **MessageList**: Scrollable message display
- **MessageBubble**: Individual message with markdown rendering
- **MessageBubbleControls**: Copy, download, text-to-speech, feedback
- **ChatInput**: Message input field
- **ChatEntry**: Welcome screen for new conversations
- **ChatInputBase**: Shared chat input UI used by chat views

### Authentication Components

- **LoginForm**: Email/password login with OAuth options
- **LoginPreviewPanel**: Desktop preview panel
- **RegisterForm**: Registration with validation
- **SessionTimeoutModal**: Inactivity warning modal

### Modal Components

- **ProfileModal**: Desktop profile management
- **AccountDetailsModal**: Mobile account details
- **LogoutModal**: Logout confirmation

### Shared UI, Hooks, and Utilities

- **Modal** (`src/components/ui/modal.tsx`): Accessible modal used by logout and timeout flows
- **ErrorBoundary** (`src/components/ui/error-boundary.tsx`): Client-side error boundary for UI crashes
- **ErrorBoundaryProvider** (`src/providers/error-boundary-provider.tsx`): Wraps the app shell in an error boundary
- **useApiError** (`src/hooks/use-api-error.ts`): Consistent general + field error handling for forms
- **useModal** (`src/hooks/use-modal.ts`): Focus management, escape/backdrop close, scroll lock
- **useChatInput** (`src/hooks/use-chat-input.ts`): Shared message input logic (submit, enter behavior, resizing)
- **Validation utilities** (`src/lib/validation/*`): Shared validation for email/name/password

## Development Guidelines

### Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- React Query for server state
- Next.js App Router patterns

### Best Practices

1. Use Tailwind CSS classes from the configured color system
2. Handle errors with user-friendly messages
3. Implement loading states for async operations
4. Test on both desktop and mobile viewports
5. Follow existing component patterns

### Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run linter
```

## Deployment

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
NEXT_PUBLIC_OAUTH_REDIRECT_URL=https://your-domain.com/auth/callback
```

### Deployment Steps

1. Build the application: `pnpm build`
2. Deploy to hosting platform (Vercel, Netlify, etc.)
3. Configure environment variables
4. Verify OAuth redirect URLs

### Production Checklist

- Environment variables configured
- OAuth redirect URLs set correctly
- API endpoints accessible
- HTTPS enabled

---

Built for warpSpeed
