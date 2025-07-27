// Mobile-safe Firebase initialization
// This file provides Firebase services with proper error handling for mobile environments

let db: any = null;
let auth: any = null;
let analytics: any = null;

// Initialize Firebase only if we have a proper configuration
export const initializeFirebase = async () => {
  try {
    // Only import and initialize Firebase if we're in a proper environment
    if (typeof window === "undefined") {
      throw new Error("Firebase not available in server environment");
    }

    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const { getAuth } = await import("firebase/auth");

    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyD8O4q7UTgepZinpcoJwP4IA-keyVxXPTY",
      authDomain: "target-4c91b.firebaseapp.com",
      projectId: "target-4c91b",
      storageBucket: "target-4c91b.firebasestorage.app",
      messagingSenderId: "966058326327",
      appId: "1:966058326327:web:72e6aeca3f11eefa7509f9",
      measurementId: "G-07EP1L9Z8V",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);

    // Initialize analytics only in production and web environment
    if (import.meta.env.PROD && !import.meta.env.VITE_MOBILE) {
      const { getAnalytics } = await import("firebase/analytics");
      analytics = getAnalytics(app);
    }

    console.log("Firebase initialized successfully");
    return { db, auth, analytics };
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    // Return null services - app will work in offline mode
    return { db: null, auth: null, analytics: null };
  }
};

// Lazy initialization
let firebasePromise: Promise<any> | null = null;

export const getFirebaseServices = async () => {
  if (!firebasePromise) {
    firebasePromise = initializeFirebase();
  }
  return await firebasePromise;
};

// Export services with lazy loading
export const getDB = async () => {
  const services = await getFirebaseServices();
  return services.db;
};

export const getAuth = async () => {
  const services = await getFirebaseServices();
  return services.auth;
};

export const getAnalytics = async () => {
  const services = await getFirebaseServices();
  return services.analytics;
};

// For backwards compatibility, export the original services
export { db, auth, analytics };
