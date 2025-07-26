import React, { createContext, useContext, useState, useEffect } from "react";
import { QuestSystemData } from '@shared/quest-types';
import { QuestEngine, DEFAULT_QUEST_PREFERENCES } from '@/lib/questEngine';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: "email" | "google";
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserData {
  goals: any[];
  addictions: any[];
  completedGoals: any[];
  questSystemData?: QuestSystemData; // New quest system integration
  disciplineData?: {
    baseScore: number; // 0-100, determined from onboarding assessment
    currentRank: string; // F-, F, F+, D-, D, D+, C-, C, C+, B-, B, B+, A-, A, A+
    totalCompletions: number;
    consistencyScore: number; // Based on streak maintenance
    lastUpdated: Date;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    reminderTime?: string;
    onboardingCompleted?: boolean;
    useQuestSystem?: boolean; // Flag to enable quest mode
  };
  privacy?: {
    showGoals: boolean;
    showRecoveries: boolean;
    profileVisibility: "public" | "private";
  };
  achievements?: Array<{
    id: string;
    earnedAt: Date;
  }>;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be a backend API
const MOCK_USERS_KEY = "target_users";
const MOCK_USER_DATA_KEY = "target_user_data_";

const getMockUsers = (): Record<string, { password: string; user: User }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveMockUsers = (
  users: Record<string, { password: string; user: User }>,
) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const getUserData = (userId: string): UserData | null => {
  const stored = localStorage.getItem(MOCK_USER_DATA_KEY + userId);
  if (!stored) return null;

  const data = JSON.parse(stored);
  // Convert date strings back to Date objects
  if (data.goals) {
    data.goals = data.goals.map((goal: any) => ({
      ...goal,
      lastUpdated: new Date(goal.lastUpdated),
    }));
  }
  if (data.completedGoals) {
    data.completedGoals = data.completedGoals.map((goal: any) => ({
      ...goal,
      completionDates: goal.completionDates.map(
        (date: string) => new Date(date),
      ),
    }));
  }

  // Convert quest system data dates
  if (data.questSystemData) {
    const qsd = data.questSystemData;

    // Convert lastQuestGeneration
    if (qsd.lastQuestGeneration) {
      qsd.lastQuestGeneration = new Date(qsd.lastQuestGeneration);
    }

    // Convert current quests dates
    if (qsd.currentQuests) {
      qsd.currentQuests = qsd.currentQuests.map((quest: any) => ({
        ...quest,
        dateAssigned: new Date(quest.dateAssigned),
        dateCompleted: quest.dateCompleted ? new Date(quest.dateCompleted) : undefined,
      }));
    }

    // Convert quest history dates
    if (qsd.questHistory) {
      qsd.questHistory = qsd.questHistory.map((quest: any) => ({
        ...quest,
        dateAssigned: new Date(quest.dateAssigned),
        dateCompleted: quest.dateCompleted ? new Date(quest.dateCompleted) : undefined,
      }));
    }

    // Convert weekly stats dates
    if (qsd.weeklyStats && qsd.weeklyStats.lastStreakDate) {
      qsd.weeklyStats.lastStreakDate = new Date(qsd.weeklyStats.lastStreakDate);
    }

    data.questSystemData = qsd;
  }

  return data;
};

const saveUserData = (userId: string, data: UserData) => {
  localStorage.setItem(MOCK_USER_DATA_KEY + userId, JSON.stringify(data));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem("target_current_user");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLoginAt: new Date(userData.lastLoginAt),
        });

        // Load user data
        const userProgressData = getUserData(userData.id);
        if (userProgressData) {
          // Initialize quest system if it doesn't exist and quest mode is enabled
          if (userProgressData.preferences?.useQuestSystem && !userProgressData.questSystemData) {
            userProgressData.questSystemData = QuestEngine.initializeQuestSystem(DEFAULT_QUEST_PREFERENCES);
            saveUserData(userData.id, userProgressData);
          }

          // Process quest rotation if quest system exists
          if (userProgressData.questSystemData) {
            const processedQuestData = QuestEngine.processQuestRotation(userProgressData.questSystemData);
            userProgressData.questSystemData = processedQuestData;
            saveUserData(userData.id, userProgressData);
          }

          setUserData(userProgressData);
        } else {
          // Initialize default user data
          const defaultData: UserData = {
            goals: [],
            addictions: [],
            completedGoals: [],
            preferences: {
              theme: "system",
              notifications: true,
              onboardingCompleted: false,
              useQuestSystem: true, // Default to quest system
            },
          };
          setUserData(defaultData);
          saveUserData(userData.id, defaultData);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getMockUsers();
      const userRecord = users[email];

      if (!userRecord || userRecord.password !== password) {
        return { success: false, error: "Invalid email or password" };
      }

      const updatedUser = {
        ...userRecord.user,
        lastLoginAt: new Date(),
      };

      // Update last login time
      users[email].user = updatedUser;
      saveMockUsers(users);

      setUser(updatedUser);
      localStorage.setItem("target_current_user", JSON.stringify(updatedUser));

      // Load user data
      const userProgressData = getUserData(updatedUser.id);
      if (userProgressData) {
        // Process quest rotation on login if quest system exists
        if (userProgressData.questSystemData) {
          const processedQuestData = QuestEngine.processQuestRotation(userProgressData.questSystemData);
          userProgressData.questSystemData = processedQuestData;
          saveUserData(updatedUser.id, userProgressData);
        }
        setUserData(userProgressData);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An error occurred during sign in" };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getMockUsers();

      if (users[email]) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        displayName,
        provider: "email",
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      users[email] = {
        password,
        user: newUser,
      };

      saveMockUsers(users);
      setUser(newUser);
      localStorage.setItem("target_current_user", JSON.stringify(newUser));

      // Initialize user data
      const defaultData: UserData = {
        goals: [],
        addictions: [],
        completedGoals: [],
        preferences: {
          theme: "system",
          notifications: true,
          onboardingCompleted: false,
          useQuestSystem: true,
        },
        privacy: {
          showGoals: true,
          showRecoveries: false,
          profileVisibility: "private",
        },
      };

      setUserData(defaultData);
      saveUserData(newUser.id, defaultData);

      return { success: true };
    } catch (error) {
      return { success: false, error: "An error occurred during sign up" };
    }
  };

  const signInWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      return new Promise((resolve) => {
        // Initialize Google Identity Services
        if (typeof window.google === "undefined") {
          resolve({
            success: false,
            error:
              "Google services not available. Please ensure you have an internet connection.",
          });
          return;
        }

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-client-id",
          callback: async (response: any) => {
            try {
              // Decode JWT token to get user info
              const credential = response.credential;
              const payload = JSON.parse(atob(credential.split(".")[1]));

              const googleUser: User = {
                id: `google_${payload.sub}`,
                email: payload.email,
                displayName: payload.name,
                photoURL: payload.picture,
                provider: "google",
                createdAt: new Date(),
                lastLoginAt: new Date(),
              };

              setUser(googleUser);
              localStorage.setItem(
                "target_current_user",
                JSON.stringify(googleUser),
              );

              // Check if user data exists
              const existingData = getUserData(googleUser.id);
              let userDataToSet: UserData;

              if (existingData) {
                userDataToSet = existingData;
              } else {
                // Initialize user data for new Google user
                userDataToSet = {
                  goals: [],
                  addictions: [],
                  completedGoals: [],
                  preferences: {
                    theme: "system",
                    notifications: true,
                    onboardingCompleted: false,
                    useQuestSystem: true,
                  },
                  privacy: {
                    showGoals: true,
                    showRecoveries: false,
                    profileVisibility: "private",
                  },
                };
                saveUserData(googleUser.id, userDataToSet);
              }

              setUserData(userDataToSet);
              resolve({ success: true });
            } catch (error) {
              console.error("Error processing Google auth response:", error);
              resolve({
                success: false,
                error: "Failed to process Google authentication",
              });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Check if we have a client ID configured
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "demo-client-id") {
          // Fall back to demo mode if no client ID is configured
          const mockGoogleUser: User = {
            id: `google_demo_${Date.now()}`,
            email: "demo@gmail.com",
            displayName: "Demo Google User",
            photoURL: `https://ui-avatars.com/api/?name=Demo+Google+User&background=4285f4&color=ffffff`,
            provider: "google",
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };

          setUser(mockGoogleUser);
          localStorage.setItem(
            "target_current_user",
            JSON.stringify(mockGoogleUser),
          );

          const existingData = getUserData(mockGoogleUser.id);
          let userDataToSet: UserData;

          if (existingData) {
            userDataToSet = existingData;
          } else {
            userDataToSet = {
              goals: [],
              addictions: [],
              completedGoals: [],
              preferences: {
                theme: "system",
                notifications: true,
                onboardingCompleted: false,
                useQuestSystem: true,
              },
              privacy: {
                showGoals: true,
                showRecoveries: false,
                profileVisibility: "private",
              },
            };
            saveUserData(mockGoogleUser.id, userDataToSet);
          }

          setUserData(userDataToSet);
          resolve({ success: true });
          return;
        }

        // Trigger Google Sign-In popup
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fall back to manual sign-in
            window.google.accounts.id.renderButton(
              document.createElement("div"),
              { theme: "outline", size: "large" },
            );

            // Since we can't directly trigger the popup, we'll show an error
            resolve({
              success: false,
              error:
                "Please enable popups and try again, or contact support if you continue having issues.",
            });
          }
        });
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        error: "Google sign in failed. Please try again or contact support.",
      };
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem("target_current_user");
  };

  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!user || !userData) return;

    const updatedData = { ...userData, ...data };
    setUserData(updatedData);
    saveUserData(user.id, updatedData);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
