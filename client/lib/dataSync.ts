import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserData } from "@/contexts/AuthContext";
import { safeStorage } from "./storage";

export interface CloudUserData extends Omit<UserData, "achievements"> {
  lastModified: Timestamp;
  deviceId: string;
  achievements?: Array<{
    id: string;
    earnedAt: Timestamp;
  }>;
}

export class DataSyncService {
  private static deviceId = this.generateDeviceId();

  private static generateDeviceId(): string {
    // Generate a unique device ID that persists across sessions
    let deviceId = safeStorage.getItem("device_id");
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      safeStorage.setItem("device_id", deviceId);
    }
    return deviceId;
  }

  static async saveUserDataToCloud(
    userId: string,
    userData: UserData,
  ): Promise<void> {
    try {
      // Convert dates to Firestore timestamps
      const cloudData: CloudUserData = {
        ...userData,
        lastModified: serverTimestamp() as Timestamp,
        deviceId: this.deviceId,
        achievements: userData.achievements?.map((achievement) => ({
          ...achievement,
          earnedAt: Timestamp.fromDate(achievement.earnedAt),
        })),
      };

      // Convert goal dates
      if (cloudData.goals) {
        cloudData.goals = cloudData.goals.map((goal) => ({
          ...goal,
          lastUpdated: goal.lastUpdated
            ? Timestamp.fromDate(goal.lastUpdated)
            : null,
        }));
      }

      // Convert completed goal dates
      if (cloudData.completedGoals) {
        cloudData.completedGoals = cloudData.completedGoals.map((goal) => ({
          ...goal,
          completionDates: goal.completionDates?.map((date: Date) =>
            Timestamp.fromDate(date),
          ),
        }));
      }

      // Convert quest system dates
      if (cloudData.questSystemData) {
        const qsd = cloudData.questSystemData;

        if (qsd.lastQuestGeneration) {
          qsd.lastQuestGeneration = Timestamp.fromDate(qsd.lastQuestGeneration);
        }

        if (qsd.currentQuests) {
          qsd.currentQuests = qsd.currentQuests.map((quest) => ({
            ...quest,
            dateAssigned: Timestamp.fromDate(quest.dateAssigned),
            dateCompleted: quest.dateCompleted
              ? Timestamp.fromDate(quest.dateCompleted)
              : undefined,
          }));
        }

        if (qsd.questHistory) {
          qsd.questHistory = qsd.questHistory.map((quest) => ({
            ...quest,
            dateAssigned: Timestamp.fromDate(quest.dateAssigned),
            dateCompleted: quest.dateCompleted
              ? Timestamp.fromDate(quest.dateCompleted)
              : undefined,
          }));
        }

        if (qsd.weeklyStats?.lastStreakDate) {
          qsd.weeklyStats.lastStreakDate = Timestamp.fromDate(
            qsd.weeklyStats.lastStreakDate,
          );
        }

        if (qsd.dailyStats) {
          qsd.dailyStats.date = Timestamp.fromDate(qsd.dailyStats.date);
          qsd.dailyStats.lastUpdated = Timestamp.fromDate(
            qsd.dailyStats.lastUpdated,
          );
        }
      }

      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, cloudData, { merge: true });
    } catch (error) {
      console.error("Error saving to cloud:", error);
      throw new Error("Failed to sync data to cloud");
    }
  }

  static async getUserDataFromCloud(userId: string): Promise<UserData | null> {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        return null;
      }

      const cloudData = docSnap.data() as CloudUserData;

      // Convert Firestore timestamps back to Date objects
      const userData: UserData = {
        ...cloudData,
        achievements: cloudData.achievements?.map((achievement) => ({
          ...achievement,
          earnedAt: achievement.earnedAt.toDate(),
        })),
      };

      // Convert goal dates
      if (userData.goals) {
        userData.goals = userData.goals.map((goal) => ({
          ...goal,
          lastUpdated: goal.lastUpdated
            ? goal.lastUpdated.toDate()
            : new Date(),
        }));
      }

      // Convert completed goal dates
      if (userData.completedGoals) {
        userData.completedGoals = userData.completedGoals.map((goal) => ({
          ...goal,
          completionDates: goal.completionDates?.map((timestamp: any) =>
            timestamp.toDate(),
          ),
        }));
      }

      // Convert quest system dates
      if (userData.questSystemData) {
        const qsd = userData.questSystemData;

        if (qsd.lastQuestGeneration) {
          qsd.lastQuestGeneration = qsd.lastQuestGeneration.toDate();
        }

        if (qsd.currentQuests) {
          qsd.currentQuests = qsd.currentQuests.map((quest) => ({
            ...quest,
            dateAssigned: quest.dateAssigned.toDate(),
            dateCompleted: quest.dateCompleted
              ? quest.dateCompleted.toDate()
              : undefined,
          }));
        }

        if (qsd.questHistory) {
          qsd.questHistory = qsd.questHistory.map((quest) => ({
            ...quest,
            dateAssigned: quest.dateAssigned.toDate(),
            dateCompleted: quest.dateCompleted
              ? quest.dateCompleted.toDate()
              : undefined,
          }));
        }

        if (qsd.weeklyStats?.lastStreakDate) {
          qsd.weeklyStats.lastStreakDate =
            qsd.weeklyStats.lastStreakDate.toDate();
        }

        if (qsd.dailyStats) {
          qsd.dailyStats.date = qsd.dailyStats.date.toDate();
          qsd.dailyStats.lastUpdated = qsd.dailyStats.lastUpdated.toDate();
        }
      }

      return userData;
    } catch (error) {
      console.error("Error loading from cloud:", error);
      throw new Error("Failed to load data from cloud");
    }
  }

  static async mergeUserData(
    localData: UserData,
    cloudData: UserData,
  ): Promise<UserData> {
    // Simple merge strategy: prefer cloud data for most fields,
    // but merge arrays to avoid data loss
    const merged: UserData = {
      ...cloudData,
      goals: this.mergeArraysByLastUpdated(
        localData.goals || [],
        cloudData.goals || [],
      ),
      completedGoals: this.mergeArraysByProperty(
        localData.completedGoals || [],
        cloudData.completedGoals || [],
        "id",
      ),
      addictions: this.mergeArraysByProperty(
        localData.addictions || [],
        cloudData.addictions || [],
        "id",
      ),
      achievements: this.mergeArraysByProperty(
        localData.achievements || [],
        cloudData.achievements || [],
        "id",
      ),
      preferences: {
        ...localData.preferences,
        ...cloudData.preferences,
      },
    };

    return merged;
  }

  private static mergeArraysByLastUpdated(
    localArray: any[],
    cloudArray: any[],
  ): any[] {
    const merged = [...cloudArray];

    localArray.forEach((localItem) => {
      const existingIndex = merged.findIndex(
        (item) => item.id === localItem.id,
      );

      if (existingIndex >= 0) {
        // Compare lastUpdated dates and keep the most recent
        const localDate = new Date(localItem.lastUpdated);
        const cloudDate = new Date(merged[existingIndex].lastUpdated);

        if (localDate > cloudDate) {
          merged[existingIndex] = localItem;
        }
      } else {
        // Item only exists locally, add it
        merged.push(localItem);
      }
    });

    return merged;
  }

  private static mergeArraysByProperty(
    localArray: any[],
    cloudArray: any[],
    property: string,
  ): any[] {
    const merged = [...cloudArray];

    localArray.forEach((localItem) => {
      if (!merged.find((item) => item[property] === localItem[property])) {
        merged.push(localItem);
      }
    });

    return merged;
  }

  static async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      // Try to fetch a small document to test connectivity
      const userDocRef = doc(db, "connectivity", "test");
      await getDoc(userDocRef);
      return true;
    } catch {
      return false;
    }
  }
}
