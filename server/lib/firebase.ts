import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8O4q7UTgepZinpcoJwP4IA-keyVxXPTY",
  authDomain: "target-4c91b.firebaseapp.com",
  projectId: "target-4c91b",
  storageBucket: "target-4c91b.firebasestorage.app",
  messagingSenderId: "966058326327",
  appId: "1:966058326327:web:72e6aeca3f11eefa7509f9",
  measurementId: "G-07EP1L9Z8V",
};

// Initialize Firebase only if no apps exist
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

export default app;
