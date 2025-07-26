import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-side Firebase configuration using Admin SDK
let app: App;

try {
  if (getApps().length === 0) {
    // For serverless environments like Netlify, we need minimal configuration
    // The application should work with default credentials or environment-based auth
    const projectId = "target-4c91b";

    // Try to use service account if provided via environment variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId,
        });
        console.log("Firebase Admin initialized with service account");
      } catch (parseError) {
        console.warn("Failed to parse service account key, falling back to default auth");
        app = initializeApp({ projectId });
      }
    } else {
      // Use default authentication (works with Google Cloud environments)
      app = initializeApp({ projectId });
      console.log("Firebase Admin initialized with default credentials");
    }
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Initialize Firestore with server-side SDK
export const db = getFirestore(app);

export default app;
