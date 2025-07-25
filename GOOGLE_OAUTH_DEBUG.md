# Google OAuth Debug Guide

## Current Issue: "The given origin is not allowed for the given client ID"

**Client ID Found:** `966058326327-h354mj5ugf01u1p7e6okafbqd3777q9t.apps.googleusercontent.com`

This error occurs when the domain/origin where your app is running is not authorized in Google Cloud Console.

## Immediate Fix Required

### Step 1: Identify Current Origins

Your app is currently running on these possible origins:

- **Development**: `http://localhost:8080` (from vite config)
- **Production**: Your deployed domain (if any)

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find the OAuth 2.0 client ID: `966058326327-h354mj5ugf01u1p7e6okafbqd3777q9t`
4. Click on it to edit
5. In the "Authorized JavaScript origins" section, add:
   - `http://localhost:8080` (for development)
   - Your production domain (if deploying)

### Step 3: Verify Configuration

**Current authorized origins likely missing:**

- `http://localhost:8080`

**What to add in Google Cloud Console:**

```
Authorized JavaScript origins:
- http://localhost:8080
- https://yourdomain.com (if you have a production domain)
```

**Important Notes:**

- Do NOT add trailing slashes (/) to origins
- Use `http://localhost:8080` for development (not `https`)
- Use `https://` for production domains
- Changes may take a few minutes to propagate

### Step 4: Test After Changes

1. Wait 2-3 minutes after making changes in Google Cloud Console
2. Refresh your app
3. Try Google Sign-In again

## Alternative: Use Demo Mode

If you can't access the Google Cloud Console or need immediate testing, you can temporarily disable the Google Client ID to use demo mode:

```bash
# Temporarily unset the Google Client ID
unset VITE_GOOGLE_CLIENT_ID
# Then restart the dev server
npm run dev
```

This will make the app fall back to demo mode for Google authentication.

## Long-term Solutions

### For Development Team

- Ensure all team members' localhost URLs are added to authorized origins
- Consider using a development Google project separate from production

### For Production

- Add your production domain to authorized origins
- Set up proper environment variable management for different environments

## Verification Checklist

- [ ] Google Cloud Console OAuth client configured
- [ ] `http://localhost:8080` added to authorized origins
- [ ] Production domain added to authorized origins (if applicable)
- [ ] Changes saved in Google Cloud Console
- [ ] Waited 2-3 minutes for propagation
- [ ] App refreshed and tested

## Security Note

The current client ID is visible in this documentation. For production apps, ensure:

- Client ID is properly restricted to your domains only
- OAuth consent screen is properly configured
- App verification is completed for production use
