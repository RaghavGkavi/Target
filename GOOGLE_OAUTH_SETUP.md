# Google OAuth Configuration Guide

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" and then "New Project"
3. Enter a project name (e.g., "Target Goal Tracker")
4. Click "Create"

## Step 2: Enable Google Identity Services

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Identity Services" or "Google Sign-In"
3. Click on "Google Identity Services API" and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in the required information:
   - **App name**: Target Goal Tracker
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click "Save and Continue"
5. For scopes, you can skip this step (click "Save and Continue")
6. Add test users if needed, then click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Give it a name (e.g., "Target Web Client")
5. Add authorized origins:
   - For development: `http://localhost:8080`
   - For production: Your actual domain (e.g., `https://yourdomain.com`)
6. Leave "Authorized redirect URIs" empty (we're using the popup flow)
7. Click "Create"

## Step 5: Configure Your Application

1. Copy the Client ID from the credentials you just created
2. Create a `.env` file in your project root (copy from `.env.example`):
   ```bash
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
3. Replace `your-client-id-here` with your actual Client ID

## Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the login page
3. Click "Continue with Google"
4. You should see the Google sign-in popup

## Troubleshooting

### Common Issues:

1. **"This app isn't verified" warning**:
   - This is normal for development
   - Click "Advanced" > "Go to [app name] (unsafe)"
   - For production, you'll need to verify your app with Google

2. **"Error 400: redirect_uri_mismatch"**:
   - Make sure your authorized origins include your current domain
   - For local development, use `http://localhost:8080`

3. **Popup blocked**:
   - Ensure popups are allowed for your domain
   - Some browsers block popups by default

4. **"Invalid client ID"**:
   - Double-check your Client ID in the `.env` file
   - Make sure there are no extra spaces or characters

### Testing in Development:

- The app will work with demo mode if no Client ID is configured
- You'll see a warning message indicating OAuth is not configured
- Once configured, the warning disappears and real Google OAuth is used

### Production Deployment:

1. Add your production domain to authorized origins
2. Set the `VITE_GOOGLE_CLIENT_ID` environment variable in your hosting platform
3. Consider verifying your app with Google for a better user experience

## Environment Variables

```bash
# Required for Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

The app gracefully falls back to demo mode if this variable is not set.
