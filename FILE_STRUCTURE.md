# Complete File Structure for Next.js AI Chat Web Portal

## Root Level Files
- `.env.local` (environment variables)
- `.gitignore`
- `next.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `tsconfig.json`
- `package.json` (already exists, needs update)

## App Directory Structure (Next.js App Router)
```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page (redirects to chat)
├── loading.tsx                   # Global loading
├── error.tsx                     # Global error boundary
├── login/
│   └── page.tsx                 # Login page
├── register/
│   ├── page.tsx                 # Registration step 1
│   ├── info/
│   │   └── page.tsx            # Registration step 2
│   └── verify/
│       └── page.tsx            # Email verification
├── auth/
│   └── callback/
│       └── page.tsx            # OAuth callback handler
├── forgot-password/
│   └── page.tsx                # Password reset request
├── chat/
│   ├── page.tsx                # Chat interface (no conversation)
│   └── [conversationId]/
│       └── page.tsx            # Specific conversation
└── api/
    └── auth/
        └── route.ts            # Auth API routes (for token handling)
```

## Source Directory Structure
```
src/
├── lib/
│   ├── api/
│   │   ├── base.ts             # Axios instance setup
│   │   ├── auth.ts             # Auth API functions
│   │   └── chat.ts             # Chat API functions
│   ├── auth/
│   │   ├── session.ts          # Session management utilities
│   │   └── middleware.ts       # Auth middleware
│   └── utils/
│       ├── storage.ts          # Token storage (localStorage/cookies)
│       └── errors.ts           # Error handling utilities
├── types/
│   ├── index.ts                # Main type exports
│   ├── auth.ts                 # Authentication types
│   ├── chat.ts                 # Chat-related types
│   └── api.ts                  # API response types
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Button component
│   │   ├── input.tsx           # Input component
│   │   ├── modal.tsx           # Modal component
│   │   ├── loading.tsx         # Loading spinner
│   │   └── error.tsx           # Error display
│   ├── auth/
│   │   ├── login-form.tsx      # Login form
│   │   ├── register-form.tsx   # Registration form
│   │   └── oauth-buttons.tsx   # OAuth login buttons
│   └── chat/
│       ├── chat-layout.tsx     # Main chat layout
│       ├── conversation-sidebar.tsx  # Conversation list sidebar
│       ├── message-list.tsx    # Message display area
│       ├── message-bubble.tsx  # Individual message component
│       ├── chat-input.tsx      # Message input component
│       ├── chat-entry.tsx      # Empty state (no conversation)
│       └── attachment-preview.tsx  # Attachment display
├── hooks/
│   ├── api/
│   │   ├── use-auth.ts         # Auth hooks
│   │   └── use-chat.ts         # Chat hooks (React Query)
│   └── use-session.ts          # Session hook
└── styles/
    └── globals.css              # Global styles + Tailwind directives
```

## Configuration Files
```
config/
└── constants.ts                 # App constants (API URLs, etc.)
```
