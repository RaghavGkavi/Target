import { RequestHandler } from "express";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
        error: "User ID is required"
      });
    }

    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: "User data not found"
      });
    }

    const userData = docSnap.data();
    
    res.json({
      success: true,
      data: userData,
      lastModified: userData.lastModified?.toDate?.()?.toISOString()
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data"
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
        error: "User ID and userData are required"
      });
    }

    const userDocRef = doc(db, "users", userId);
    const dataWithTimestamp = {
      ...userData,
      lastModified: serverTimestamp()
    };

    await setDoc(userDocRef, dataWithTimestamp, { merge: true });
    
    res.json({
      success: true,
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save user data"
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
        error: "User ID and updates are required"
      });
    }

    const userDocRef = doc(db, "users", userId);
    const updatesWithTimestamp = {
      ...updates,
      lastModified: serverTimestamp()
    };

    await updateDoc(userDocRef, updatesWithTimestamp);
    
    res.json({
      success: true,
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user data"
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
        error: "User ID is required"
      });
    }

    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    res.json({
      success: true,
      exists: docSnap.exists(),
      lastModified: docSnap.exists() ? docSnap.data()?.lastModified?.toDate?.()?.toISOString() : null
    });
  } catch (error) {
    console.error("Error checking user data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check user data"
    });
  }
};
