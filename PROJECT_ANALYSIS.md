# AI Chat Web Portal - Project Analysis

## Executive Summary

This document provides a comprehensive analysis of the current project state and requirements for building the AI Chat Web Portal as a Next.js application. The project currently uses Expo/React Native with expo-router, but needs to be migrated/rebuilt as a Next.js TypeScript application with the App Router.

## Current Project State

### Technology Stack (Current)
- **Framework**: Expo/React Native with expo-router
- **Language**: TypeScript
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: expo-router
- **Styling**: React Native StyleSheet
- **Package Manager**: pnpm

### Required Technology Stack (Target)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **State Management**: React Query (where justified) or Server Components
- **Routing**: Next.js App Router
- **Styling**: Tailwind CSS (with optional react-native-web for component reuse)
- **Package Manager**: pnpm

## API Architecture Analysis

### Base Configuration
- **API Base URL**: `https://api.iamwarpspeed.com`
- **Upload URL**: `https://upload.iamwarpspeed.com`
- **Authentication**: Bearer token in Authorization header
- **Timeout**: 40s (standard), 120s (chat messages), 300s (uploads)

### Authentication Endpoints

#### Login Flow
- `POST /auth/login` - Email/password authentication
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: User }`
  
- `POST /auth/register` - User registration
  - Request: `{ firstName, lastName, email, password, confirmPassword }`
  - Response: `{ token: string, user: User }`

#### OAuth Flows
- `GET /auth/user/google` - Initiate Google OAuth
  - Returns: `{ authUrl: string }`
- `GET /auth/user/apple` - Initiate Apple OAuth
- `GET /auth/user/facebook` - Initiate Facebook OAuth

OAuth callback URL contains:
- `accessToken` - JWT token
- `isRegistration` - boolean flag

#### Session Management
- `GET /auth/user` - Get current user (validates token)
- `GET /auth/authenticate` - Verify token validity
- `POST /auth/logout` - Logout user

#### Password Reset
- `POST /auth/request-reset-password` - Request reset email
- `PUT /auth/reset-password` - Reset password with token

### AI Chat API Endpoints

#### Core Chat Operations
- `POST /ai-chat/message` - Send new message
  - Request: `{ message: string, conversationId?: string, uploadedAttachments?: [...], appContext?: {...} }`
  - Response: `{ id, conversationId, message, metadata, attachments, ... }`
  - Timeout: 120 seconds (2 minutes)

- `GET /ai-chat/conversations` - List all conversations
  - Query Params: `page`, `limit`, `search?`
  - Response: `{ data: IChatSession[], pagination: {...} }`

- `GET /ai-chat/conversations/{conversationId}` - Get conversation with messages
  - Query Params: `page`, `limit`
  - Response: `{ id, userId, messages: MessageType[], pagination: {...} }`

#### Additional Features
- `GET /ai-chat/conversations/{conversationId}/messages/{messageId}/citations` - Get message citations
- `POST /ai-chat/conversations/{conversationId}/messages/{messageId}/report` - Report inappropriate message
- `POST /ai-chat/conversations/{conversationId}/download` - Download conversation (PDF/DOCX)

### Legacy Endpoints (Backward Compatibility)
- `POST /chat-ai/message` - Old endpoint (still supported)
- `GET /chat-ai/conversations/{conversationId}/messages` - Old endpoint

## Data Models

### Conversation (IChatSession)
```typescript
{
  id: string
  userId: string
  title?: string
  createdAt: string
  updatedAt: string
  // Additional metadata
}
```

### Message (MessageType)
```typescript
{
  id: string
  message: string
  role: 'USER' | 'ASSISTANT'
  metadata: {
    citations?: Array<{...}>
    finishReason?: string
    role: string
  }
  attachments?: Attachment[]
  createdAt: string
  conversationId?: string
}
```

### Attachment
```typescript
{
  id: string
  objectPath: string
  originalFilename: string
  mimetype: string
  size: number
  url?: string
}
```

## Current Mobile App Architecture

### Key Components

#### ChatAI Component (`src/components/chat-ai/index.tsx`)
- Main chat interface container
- Manages conversation state
- Handles message sending/receiving
- Integrates with conversation list sidebar
- Features:
  - Entry view for new conversations
  - Message list with infinite scroll
  - Attachment handling
  - Input controls with file upload
  - Real-time message updates

#### ChatSideMenu Component
- Conversation history sidebar
- Search functionality
- Grouped by date (Today, Yesterday, etc.)
- Pagination support
- Click to switch conversations

#### useAssistantManager Hook
- Core chat logic management
- Message state handling
- API integration
- Error handling
- Attachment processing
- Conversation creation/loading

### State Management Pattern

1. **Conversations**: React Query infinite query
   - Key: `['chat-ai-conversations', params]`
   - Paginated list with search

2. **Messages**: React Query infinite query
   - Key: `['chat-ai-conversation-messages', params]`
   - Loaded per conversation
   - Infinite scroll support

3. **User Session**: React Query with react-query-auth
   - Token stored in AsyncStorage (mobile)
   - Token injected into axios interceptors
   - Auto-refresh on token expiration

### Authentication Flow

1. **Initial Load**:
   - Load token from storage
   - Validate token with `/auth/user`
   - Redirect to login if invalid/expired

2. **Login Process**:
   - Email/password → `POST /auth/login`
   - Store token → Set in axios interceptors
   - Redirect to chat

3. **OAuth Process**:
   - Request auth URL
   - Open OAuth provider
   - Extract token from callback
   - Store and set token

4. **Session Management**:
   - Token in Authorization header: `Bearer {token}`
   - 401 errors trigger logout
   - Token refresh (if implemented) needs to be handled

## Design System

### Colors
Primary brand colors from `src/constants/Colors.ts`:
- **Primary**: `#006C67` (teal green)
- **Secondary**: `#531CB3` (purple)
- **Background**: `#F4F5FA` (light grey)
- **Text**: `#1E1E1E` (dark grey)
- **Error**: `#BE1E2D` (red)

### Typography
- Heading variants (h1-h4)
- Body text
- Labels and captions

### UI Components (Reusable)
- Button (multiple variants)
- Input fields
- Modals
- Loading states
- Error states
- Message bubbles
- Chat input controls

## Requirements Analysis

### Functional Requirements

#### 1. Access AI Chat on Web
- **Status**: Needs implementation
- **Components**:
  - Login page (mirror mobile flow)
  - Chat interface page
  - Conversation list sidebar
  - Message display area
  - Input area

#### 2. Sync Context and Memory
- **Status**: API supports this via conversationId
- **Implementation**:
  - All messages tied to conversationId
  - Same API endpoints ensure consistency
  - Real-time sync via polling or WebSocket (to be determined)

#### 3. Secure Authentication
- **Status**: API endpoints ready
- **Implementation Needed**:
  - Next.js middleware for route protection
  - Cookie-based or localStorage token storage (web-safe)
  - OAuth callback handlers
  - Token refresh mechanism
  - Session timeout handling

#### 4. Start New Chats & Continue Existing
- **Status**: API supports
- **Implementation**:
  - "New Chat" button → clears conversationId
  - Conversation list shows all threads
  - Click conversation → load messages
  - URL-based routing: `/chat/[conversationId]`

#### 5. Error Handling
- **Status**: Needs implementation
- **Scenarios**:
  - Network failures → Retry button
  - 401 errors → Redirect to login
  - 400 errors → Show user-friendly message
  - Loading failures → Refresh option
  - Offline state → Show offline indicator

### Technical Implementation Plan

#### Phase 1: Project Setup
1. ✅ Next.js 15 project structure
2. ✅ TypeScript configuration
3. ✅ Tailwind CSS setup
4. ✅ API client setup (axios)
5. ✅ React Query provider
6. ✅ Authentication middleware

#### Phase 2: Authentication
1. Login page (email/password)
2. OAuth handlers (Google, Apple, Facebook)
3. Magic link support (if API provides)
4. Session management (cookies/tokens)
5. Protected routes middleware
6. Logout functionality

#### Phase 3: Chat Interface
1. Main chat layout (desktop-optimized)
2. Conversation sidebar
3. Message list component
4. Message input component
5. Attachment upload
6. Real-time message updates

#### Phase 4: Features
1. New conversation creation
2. Conversation switching
3. Message pagination (infinite scroll)
4. Search conversations
5. Message citations display
6. Report message functionality
7. Download conversation

#### Phase 5: Polish
1. Error states and handling
2. Loading states
3. Offline handling
4. Responsive design
5. Performance optimization
6. Accessibility

## Key Implementation Considerations

### 1. Token Storage (Web vs Mobile)
- **Mobile**: AsyncStorage (secure, persistent)
- **Web**: 
  - Option A: httpOnly cookies (most secure, SSR-friendly)
  - Option B: localStorage (simpler, client-only)
  - **Recommendation**: httpOnly cookies with CSRF protection

### 2. Real-time Updates
- **Current**: Polling or manual refresh
- **Options**:
  - Polling every 5-10 seconds
  - WebSocket connection (if API supports)
  - Server-Sent Events (SSE)
  - **Recommendation**: Start with polling, upgrade to WebSocket later

### 3. State Management
- **Server Components**: Use for initial data loading
- **Client Components**: Use for interactive features
- **React Query**: Use for caching, mutations, optimistic updates
- **Avoid**: Redux (as per requirements)

### 4. Component Reusability
- **Option A**: Use `react-native-web` for existing components
  - Pros: Faster development, code reuse
  - Cons: Potential styling issues, bundle size
- **Option B**: Rewrite components with Tailwind CSS
  - Pros: Better web optimization, smaller bundle
  - Cons: More development time
- **Recommendation**: Hybrid approach - reuse logic, rewrite UI with Tailwind

### 5. Routing Structure
```
/                          → Redirect to /chat
/login                     → Login page
/register                  → Registration pages
/auth/callback             → OAuth callback handler
/chat                      → Chat interface (no conversation)
/chat/[conversationId]     → Specific conversation
```

### 6. API Client Setup
- Base URL: `https://api.iamwarpspeed.com`
- Token injection via axios interceptors
- Error handling middleware
- Request/response logging (dev only)
- Timeout configuration per endpoint

## Design Files Reference
- **Desktop Design**: [Link provided in requirements]
- **Mobile Design**: [Link provided in requirements]
- **Note**: Designs must be strictly followed

## Open Questions / To Clarify

1. **Magic Link**: Does the API support magic link authentication? Not clear from current codebase.
2. **Token Refresh**: Is there a refresh token endpoint, or are tokens long-lived?
3. **Real-time**: Does the API support WebSocket/SSE for real-time updates?
4. **Rate Limiting**: What are the API rate limits?
5. **File Upload**: Details on presigned URL flow for attachments?
6. **Session Timeout**: What is the token expiration time?
7. **Data Sharing Setting**: The mobile app checks `userData.settings.dataSharing` - what does this control?

## Next Steps

1. Set up Next.js project structure
2. Configure Tailwind CSS with design tokens
3. Implement authentication flow
4. Build chat interface components
5. Integrate API endpoints
6. Add error handling and loading states
7. Test cross-device synchronization
8. Optimize for production

---

**Analysis Date**: 2024
**Current Codebase**: Expo/React Native
**Target**: Next.js 15 with App Router
