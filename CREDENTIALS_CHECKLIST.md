# OAuth Credentials Checklist

## ✅ Frontend Environment Variables (Required)

You need to create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com

# OAuth Redirect URL (for development)
NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

**Status:** ❌ **MISSING** - No `.env.local` file found

---

## 🔐 Backend OAuth Configuration (Required)

The OAuth credentials are configured on the **BACKEND** (api.iamwarpspeed.com), not the frontend. You need to ensure your backend has:

### Google OAuth
- ✅ Google Client ID
- ✅ Google Client Secret
- ✅ Authorized Redirect URI: `https://api.iamwarpspeed.com/auth/callback/google` (or your domain)
- ✅ Authorized JavaScript Origins: Your frontend domain
- ✅ **OAuth Consent Screen Configured** (REQUIRED - see GOOGLE_OAUTH_FIX.md)
  - App name, support email, logo
  - **Privacy Policy URL** (REQUIRED)
  - **Terms of Service URL** (REQUIRED)
  - Authorized domains
  - App published OR test users added

### Apple OAuth
- ✅ Apple Client ID (Service ID)
- ✅ Apple Team ID
- ✅ Apple Key ID
- ✅ Apple Private Key
- ✅ Redirect URI configured in Apple Developer Console

### Facebook OAuth (if used)
- ✅ Facebook App ID
- ✅ Facebook App Secret
- ✅ Valid OAuth Redirect URI

---

## 📋 Current Status

### Frontend Configuration
- ❌ `.env.local` file: **NOT FOUND**
- ✅ API client configured: **YES** (uses defaults)
- ✅ OAuth callback handler: **YES** (`app/auth/callback/page.tsx`)

### What You Need to Do

1. **Create `.env.local` file:**
   ```bash
   # In project root
   touch .env.local
   ```

2. **Add environment variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.iamwarpspeed.com
   NEXT_PUBLIC_UPLOAD_URL=https://upload.iamwarpspeed.com
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

3. **For Production:**
   Update `NEXT_PUBLIC_OAUTH_REDIRECT_URL` to your production domain:
   ```env
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=https://yourdomain.com/auth/callback
   ```

4. **Verify Backend OAuth Setup:**
   - Contact backend team to verify OAuth credentials are configured
   - Ensure redirect URIs match your frontend domain
   - Test OAuth endpoints: `GET /auth/user/google`, `/auth/user/apple`

---

## 🧪 Testing OAuth

1. **Check API Endpoint:**
   ```bash
   curl https://api.iamwarpspeed.com/auth/user/google
   ```
   Should return: `{ "authUrl": "https://accounts.google.com/..." }`

2. **Test in Browser:**
   - Click "Continue With Google"
   - Should redirect to Google login
   - After login, should redirect back to `/auth/callback?accessToken=...`
   - Should then redirect to `/chat`

---

## ⚠️ Important Notes

1. **No Frontend OAuth Credentials Needed:**
   - The frontend does NOT need Google Client ID, Apple Client ID, etc.
   - OAuth is handled entirely by the backend
   - Frontend only initiates the flow via API call

2. **The `ERR_BLOCKED_BY_CLIENT` Error:**
   - This is from Google's analytics being blocked by ad blockers
   - **This is harmless** and won't prevent OAuth from working
   - You can safely ignore it

3. **Backend Must Have:**
   - OAuth credentials configured
   - Correct redirect URIs registered with OAuth providers
   - CORS enabled for your frontend domain

---

## 🔍 Verification Steps

Run these commands to verify your setup:

```bash
# Check if .env.local exists
ls -la .env.local

# Check environment variables (in Next.js app)
# They should be available at runtime as process.env.NEXT_PUBLIC_*
```

---

## 📞 If OAuth Still Doesn't Work

### Common Error: "Access blocked: warpSpeed's request does not comply with Google's policies"

**This means the Google OAuth Consent Screen is not properly configured.**

**See:** `GOOGLE_OAUTH_FIX.md` for complete fix instructions.

**Quick Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Fill in ALL required fields:
   - App name, support email
   - **Privacy Policy URL** (REQUIRED)
   - **Terms of Service URL** (REQUIRED)
   - Authorized domains
4. Publish app OR add test users
5. Verify OAuth 2.0 Client ID has correct redirect URIs

### Other Issues:

1. **Check Browser Console:**
   - Look for actual errors (not the blocked analytics)
   - Check Network tab for failed API calls

2. **Verify Backend:**
   - Test: `GET https://api.iamwarpspeed.com/auth/user/google`
   - Should return valid `authUrl`

3. **Check Redirect URIs:**
   - Ensure backend has your frontend domain in allowed redirect URIs
   - For localhost: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
