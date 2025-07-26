import { RequestHandler } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebase";

export interface UserDataRequest {
  userId: string;
  userData: any;
}

export interface UserDataResponse {
  success: boolean;
  data?: any;
  error?: string;
  lastModified?: string;
}

// Get user data from Firestore
export const getUserData: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const userDocRef = db.collection("users").doc(userId);
    const docSnap = await userDocRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        error: "User data not found",
      });
    }

    const userData = docSnap.data();

    res.json({
      success: true,
      data: userData,
      lastModified: userData.lastModified?.toDate?.()?.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data",
    });
  }
};

// Save user data to Firestore
export const saveUserData: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;

    if (!userId || !userData) {
      return res.status(400).json({
        success: false,
        error: "User ID and userData are required",
      });
    }

    const userDocRef = db.collection("users").doc(userId);
    const dataWithTimestamp = {
      ...userData,
      lastModified: FieldValue.serverTimestamp(),
    };

    await userDocRef.set(dataWithTimestamp, { merge: true });

    res.json({
      success: true,
      lastModified: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save user data",
    });
  }
};

// Update specific fields in user data
export const updateUserData: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { updates } = req.body;

    if (!userId || !updates) {
      return res.status(400).json({
        success: false,
        error: "User ID and updates are required",
      });
    }

    const userDocRef = db.collection("users").doc(userId);
    const updatesWithTimestamp = {
      ...updates,
      lastModified: FieldValue.serverTimestamp(),
    };

    await userDocRef.update(updatesWithTimestamp);

    res.json({
      success: true,
      lastModified: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user data",
    });
  }
};

// Check if user data exists
export const checkUserData: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    console.log(`Checking user data for userId: ${userId}`);

    // Check if Firebase is properly initialized
    if (!db) {
      console.error("Firebase Admin SDK not properly initialized");
      return res.status(500).json({
        success: false,
        error: "Firebase service unavailable. Please check server configuration.",
      });
    }

    const userDocRef = db.collection("users").doc(userId);
    const docSnap = await userDocRef.get();

    const exists = docSnap.exists;
    let lastModified = null;

    if (exists) {
      const data = docSnap.data();
      if (
        data?.lastModified &&
        typeof data.lastModified.toDate === "function"
      ) {
        lastModified = data.lastModified.toDate().toISOString();
      }
    }

    console.log(`User data exists: ${exists}, lastModified: ${lastModified}`);

    res.json({
      success: true,
      exists,
      lastModified,
    });
  } catch (error) {
    console.error("Error checking user data:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      userId: req.params.userId,
      errorCode: (error as any)?.code,
      errorDetails: (error as any)?.details,
    });

    // Provide more specific error messages based on error type
    let errorMessage = "Failed to check user data";
    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "Firebase permission denied. Check service account configuration.";
      } else if (error.message.includes("not found")) {
        errorMessage = "Firebase project not found. Check project configuration.";
      } else if (error.message.includes("credential")) {
        errorMessage = "Firebase authentication failed. Check service account credentials.";
      } else {
        errorMessage = `Firebase error: ${error.message}`;
      }
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};
