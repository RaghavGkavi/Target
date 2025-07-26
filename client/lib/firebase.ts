import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize analytics only in production
let analytics;
if (typeof window !== "undefined" && import.meta.env.PROD) {
  analytics = getAnalytics(app);
}

// Connect to emulators in development
if (import.meta.env.DEV && typeof window !== "undefined") {
  // Only connect to emulators if they haven't been connected already
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
  } catch (error) {
    // Emulators already connected or not available
    console.log("Firebase emulators not available, using production");
  }
}

export { analytics };
export default app;
