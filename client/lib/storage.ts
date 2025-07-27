/**
 * Safe localStorage utility that handles mobile environments
 * where localStorage might not be immediately available
 */

class SafeStorage {
  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 
             window.localStorage !== null && 
             window.localStorage !== undefined;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      if (!this.isAvailable()) {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('SafeStorage: Failed to get item', key, error);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('SafeStorage: Failed to set item', key, error);
      return false;
    }
  }

  removeItem(key: string): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('SafeStorage: Failed to remove item', key, error);
      return false;
    }
  }

  clear(): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('SafeStorage: Failed to clear storage', error);
      return false;
    }
  }
}

export const safeStorage = new SafeStorage();
