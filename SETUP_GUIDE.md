# AI Chat Web Portal - Setup Guide

## Prerequisites

- Node.js 18+ 
- pnpm 8.0+
- An account on warpSpeed app with access to `api.iamwarpspeed.com`

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
   NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to /chat)
│   ├── login/                   # Login page
│   ├── register/                # Registration pages
│   ├── chat/                    # Chat interface
│   │   ├── page.tsx            # New conversation
│   │   └── [conversationId]/   # Specific conversation
│   └── auth/                    # OAuth callback handler
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   └── chat/               # Chat-specific components
│   ├── hooks/                  # Custom React hooks
│   │   └── api/                # API hooks (React Query)
│   ├── lib/                    # Utilities and API clients
│   │   ├── api/                # API client functions
│   │   └── utils/              # Utility functions
│   ├── providers/              # React context providers
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── middleware.ts               # Next.js middleware (auth protection)
└── Configuration files...
```

## Key Features

### Authentication
- Email/password login
- User registration
- OAuth (Google, Apple, Facebook)
- Password reset flow
- Email verification
- Session management with token storage

### Chat Interface
- Real-time conversation display
- Message history with pagination
- Conversation sidebar with search
- Markdown rendering for AI responses
- Citation/source links
- New conversation creation
- Conversation switching

### API Integration
- Full integration with warpSpeed API
- Automatic token management
- Error handling and retry logic
- Loading states

## API Endpoints Used

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `GET /auth/user` - Get current user
- `GET /auth/user/{provider}` - OAuth initiation

### Chat
- `POST /ai-chat/message` - Send message
- `GET /ai-chat/conversations` - List conversations
- `GET /ai-chat/conversations/{id}` - Get conversation messages
- `GET /query/suggestions` - Get chat suggestions

## Development

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Formatting
```bash
pnpm format
```

### Building for Production
```bash
pnpm build
pnpm start
```

## Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom design tokens matching the warpSpeed brand colors. See `tailwind.config.js` for the full color palette.

### API Client
The API client is configured in `src/lib/api/base.ts` with:
- Base URL from environment variables
- Automatic token injection
- Response interceptors for error handling
- 401 handling (auto-redirect to login)

## Troubleshooting

### Authentication Issues
- Ensure your token is stored in localStorage (check browser dev tools)
- Verify API URL is correct in `.env.local`
- Check network tab for API errors

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && pnpm install`

### TypeScript Errors
- Run `pnpm type-check` to see all type errors
- Ensure all dependencies are installed

## Next Steps

1. **Test Authentication Flow:**
   - Register a new account
   - Verify email
   - Login with credentials
   - Test OAuth providers

2. **Test Chat Functionality:**
   - Create a new conversation
   - Send messages
   - Switch between conversations
   - Test search functionality

3. **Customization:**
   - Adjust colors in `tailwind.config.js`
   - Modify components in `src/components`
   - Add additional features as needed

## Support

For issues or questions:
1. Check the API documentation in `api.json`
2. Review error messages in browser console
3. Check network requests in browser dev tools
