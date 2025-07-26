import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-side Firebase configuration using Admin SDK
let app: App;

try {
  if (getApps().length === 0) {
    // Try to initialize with service account credentials if available
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Use service account for authentication
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: "target-4c91b",
      });
    } else {
      // Fallback to using project ID only (works in some environments)
      app = initializeApp({
        projectId: "target-4c91b",
      });
    }
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  // Initialize with minimal config as fallback
  app = initializeApp({
    projectId: "target-4c91b",
  });
}

// Initialize Firestore with server-side SDK
export const db = getFirestore(app);

export default app;
