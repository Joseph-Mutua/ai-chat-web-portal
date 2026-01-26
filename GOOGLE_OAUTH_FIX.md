# Fix: Google OAuth "Request Does Not Comply with Google's Policies"

## 🔴 The Problem

**Error:** "Access blocked: warpSpeed's request does not comply with Google's policies"

This error occurs when Google's OAuth consent screen is not properly configured in the Google Cloud Console.

---

## ✅ Solution: Configure Google OAuth Consent Screen

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one for warpSpeed)
3. Navigate to **APIs & Services** → **OAuth consent screen**

### Step 2: Configure OAuth Consent Screen

#### Required Information:

1. **User Type:**
   - Choose **External** (for public users) or **Internal** (for Google Workspace only)
   - For production, usually **External**

2. **App Information:**
   - **App name:** `warpSpeed` (or your app name)
   - **User support email:** Your support email
   - **App logo:** Upload your app logo (optional but recommended)
   - **Application home page:** `https://yourdomain.com` or `https://iamwarpspeed.com`
   - **Application privacy policy link:** **REQUIRED** - Must be a valid URL
   - **Application terms of service link:** **REQUIRED** - Must be a valid URL
   - **Authorized domains:** Add your domain (e.g., `iamwarpspeed.com`)

3. **Scopes:**
   - Add required scopes:
     - `openid`
     - `email`
     - `profile`
   - Only request scopes you actually need

4. **Test Users (if in Testing mode):**
   - Add test user emails who can access the app
   - Or publish the app for public access

### Step 3: Publish the App

1. If your app is in **Testing** mode:
   - Either add test users, OR
   - Click **Publish App** to make it available to all users
   - Note: Publishing requires verification if requesting sensitive scopes

2. **App Verification (if needed):**
   - If requesting sensitive scopes, Google may require app verification
   - This can take several days
   - For basic scopes (email, profile), usually not required

### Step 4: Configure OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Find or create **OAuth 2.0 Client ID**
3. Configure:
   - **Application type:** Web application
   - **Name:** warpSpeed Web Client
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs:**
     - `https://api.iamwarpspeed.com/auth/callback/google`
     - `http://localhost:3000/auth/callback` (if testing locally)

### Step 5: Backend Configuration

Ensure your backend (`api.iamwarpspeed.com`) has:

1. **Google Client ID** from Google Cloud Console
2. **Google Client Secret** from Google Cloud Console
3. **Redirect URI** configured to: `https://api.iamwarpspeed.com/auth/callback/google`
4. OAuth library properly configured (e.g., Passport.js, Google OAuth library)

---

## 🚨 Common Issues & Fixes

### Issue 1: Missing Privacy Policy or Terms of Service

**Error:** "Privacy policy URL is required"

**Fix:**
- Create privacy policy page: `https://yourdomain.com/privacy`
- Create terms of service page: `https://yourdomain.com/terms`
- Add these URLs in OAuth consent screen configuration

### Issue 2: App in Testing Mode

**Error:** "Access blocked: This app's request is invalid"

**Fix:**
- Add your email as a test user in OAuth consent screen
- OR publish the app for public access

### Issue 3: Invalid Redirect URI

**Error:** "redirect_uri_mismatch"

**Fix:**
- Ensure redirect URI in Google Cloud Console matches exactly:
  - Backend: `https://api.iamwarpspeed.com/auth/callback/google`
  - Frontend (if using direct OAuth): `https://yourdomain.com/auth/callback`
- No trailing slashes, exact match required

### Issue 4: Unverified App

**Error:** "Access blocked: Unverified app"

**Fix:**
- For sensitive scopes, Google requires app verification
- For basic scopes (email, profile), usually not required
- Submit app for verification if needed (can take 4-6 weeks)

---

## 📋 Quick Checklist

- [ ] OAuth consent screen configured in Google Cloud Console
- [ ] App name, support email, and logo set
- [ ] **Privacy policy URL** added (REQUIRED)
- [ ] **Terms of service URL** added (REQUIRED)
- [ ] Authorized domains added
- [ ] OAuth scopes configured (email, profile, openid)
- [ ] App published OR test users added
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs configured correctly
- [ ] Backend has Google Client ID and Secret
- [ ] Backend redirect URI matches Google Cloud Console

---

## 🔍 Testing

1. **Test OAuth Endpoint:**
   ```bash
   curl https://api.iamwarpspeed.com/auth/user/google
   ```
   Should return: `{ "authUrl": "https://accounts.google.com/..." }`

2. **Test in Browser:**
   - Click "Continue With Google"
   - Should redirect to Google login (not show error)
   - After login, should redirect back with token

3. **Check Google Cloud Console:**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Check for any warnings or errors
   - Verify all required fields are filled

---

## 📞 Backend Team Action Items

The backend team needs to:

1. **Access Google Cloud Console** for the warpSpeed project
2. **Configure OAuth Consent Screen** with all required information
3. **Create/Update OAuth 2.0 Client ID** with correct redirect URIs
4. **Ensure backend code** uses the correct Client ID and Secret
5. **Test the OAuth flow** end-to-end

---

## 🆘 If Still Not Working

1. **Check Google Cloud Console:**
   - Look for any warnings or errors in OAuth consent screen
   - Check if app is published or in testing mode
   - Verify all required fields are filled

2. **Check Backend Logs:**
   - Look for OAuth-related errors
   - Verify Client ID and Secret are correct
   - Check redirect URI matches

3. **Test OAuth URL Directly:**
   - Get the `authUrl` from backend API
   - Open it in browser
   - See what error Google shows (if any)

4. **Contact Google Support:**
   - If app verification is required
   - If you're unsure about compliance issues

---

## 📝 Notes

- **Privacy Policy and Terms of Service are REQUIRED** - Google will block OAuth without them
- **App must be published** OR test users must be added
- **Redirect URIs must match exactly** - no trailing slashes, exact protocol (http vs https)
- **OAuth consent screen configuration is a one-time setup** - once done, it works for all users
