import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserData {
  goals: any[];
  addictions: any[];
  completedGoals: any[];
  disciplineData?: {
    baseScore: number; // 0-100, determined from onboarding assessment
    currentRank: string; // F-, F, F+, D-, D, D+, C-, C, C+, B-, B, B+, A-, A, A+
    totalCompletions: number;
    consistencyScore: number; // Based on streak maintenance
    lastUpdated: Date;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    reminderTime?: string;
    onboardingCompleted?: boolean;
  };
  privacy?: {
    showGoals: boolean;
    showRecoveries: boolean;
    profileVisibility: 'public' | 'private';
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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be a backend API
const MOCK_USERS_KEY = 'target_users';
const MOCK_USER_DATA_KEY = 'target_user_data_';

const getMockUsers = (): Record<string, { password: string; user: User }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveMockUsers = (users: Record<string, { password: string; user: User }>) => {
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
      lastUpdated: new Date(goal.lastUpdated)
    }));
  }
  if (data.completedGoals) {
    data.completedGoals = data.completedGoals.map((goal: any) => ({
      ...goal,
      completionDates: goal.completionDates.map((date: string) => new Date(date))
    }));
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
      const currentUser = localStorage.getItem('target_current_user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLoginAt: new Date(userData.lastLoginAt)
        });
        
        // Load user data
        const userProgressData = getUserData(userData.id);
        if (userProgressData) {
          setUserData(userProgressData);
        } else {
          // Initialize default user data
          const defaultData: UserData = {
            goals: [],
            addictions: [],
            completedGoals: [],
            preferences: {
              theme: 'system',
              notifications: true,
              onboardingCompleted: false
            }
          };
          setUserData(defaultData);
          saveUserData(userData.id, defaultData);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getMockUsers();
      const userRecord = users[email];
      
      if (!userRecord || userRecord.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      const updatedUser = {
        ...userRecord.user,
        lastLoginAt: new Date()
      };
      
      // Update last login time
      users[email].user = updatedUser;
      saveMockUsers(users);
      
      setUser(updatedUser);
      localStorage.setItem('target_current_user', JSON.stringify(updatedUser));
      
      // Load user data
      const userProgressData = getUserData(updatedUser.id);
      if (userProgressData) {
        setUserData(userProgressData);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getMockUsers();
      
      if (users[email]) {
        return { success: false, error: 'An account with this email already exists' };
      }
      
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        displayName,
        provider: 'email',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      users[email] = {
        password,
        user: newUser
      };
      
      saveMockUsers(users);
      setUser(newUser);
      localStorage.setItem('target_current_user', JSON.stringify(newUser));
      
      // Initialize user data
      const defaultData: UserData = {
        goals: [],
        addictions: [],
        completedGoals: [],
        preferences: {
          theme: 'system',
          notifications: true,
          onboardingCompleted: false
        },
        privacy: {
          showGoals: true,
          showRecoveries: false,
          profileVisibility: 'private'
        }
      };

      setUserData(defaultData);
      saveUserData(newUser.id, defaultData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during sign up' };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate Google OAuth flow
      const mockGoogleUser: User = {
        id: `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        displayName: 'Google User',
        photoURL: `https://ui-avatars.com/api/?name=Google+User&background=random`,
        provider: 'google',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      setUser(mockGoogleUser);
      localStorage.setItem('target_current_user', JSON.stringify(mockGoogleUser));
      
      // Initialize user data
      const defaultData: UserData = {
        goals: [],
        addictions: [],
        completedGoals: [],
        preferences: {
          theme: 'system',
          notifications: true,
          onboardingCompleted: false
        },
        privacy: {
          showGoals: true,
          showRecoveries: false,
          profileVisibility: 'private'
        }
      };

      setUserData(defaultData);
      saveUserData(mockGoogleUser.id, defaultData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Google sign in failed' };
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('target_current_user');
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
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
