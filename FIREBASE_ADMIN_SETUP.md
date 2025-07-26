# Firebase Admin SDK Setup for Netlify

The 500 error you're experiencing is because the Firebase Admin SDK needs proper authentication to access Firestore from the server side.

## Setup Steps

### 1. Create a Service Account in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`target-4c91b`)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Save the JSON file (keep it secure!)

### 2. Set Environment Variable in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site configuration** > **Environment variables**
3. Add a new environment variable:
   - **Key**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Copy the entire contents of the service account JSON file

### 3. Example Service Account JSON Structure

The JSON should look like this:
```json
{
  "type": "service_account",
  "project_id": "target-4c91b",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@target-4c91b.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 4. Firestore Security Rules

Make sure your Firestore rules allow the service account to read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow service account full access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or for more specific user data access:
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Testing Locally

To test locally, you can set the environment variable:
```bash
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
npm run dev
```

### Alternative: Firebase App Check (More Complex)

If you prefer not to use service accounts, you can implement Firebase App Check, but this requires more complex setup.

## Troubleshooting

- Ensure the service account has **Firestore Admin** permissions
- Check that the JSON is properly formatted (no extra whitespace)
- Verify the project ID matches your Firebase project
- Check Netlify function logs for detailed error messages
