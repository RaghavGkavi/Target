import { isNativePlatform } from '@capacitor/core';

/**
 * Initialize Google Auth for mobile platforms
 */
export async function initializeMobileGoogleAuth(): Promise<void> {
  try {
    // Check if we're in a mobile environment using the reliable Capacitor utility
    if (isMobileEnvironment()) {
      // Dynamically import the Google Auth plugin only in mobile environment
      const { GoogleAuth } = await import(
        "@codetrix-studio/capacitor-google-auth"
      );

      await GoogleAuth.initialize({
        clientId: "536356601851-da4n93omgcdupo19scn650j011bph9sb.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      });
      console.log("Mobile Google Auth initialized successfully");
    }
  } catch (error) {
    console.warn("Failed to initialize mobile Google Auth:", error);
  }
}

/**
 * Check if we're running in a mobile environment.
 * This is the corrected, more reliable implementation.
 */
export function isMobileEnvironment(): boolean {
  // isNativePlatform() correctly identifies if the code is running on a native device,
  // regardless of whether it's a live reload or a production build.
  return isNativePlatform();
}

/**
 * Get the platform-specific Google Auth implementation
 */
export async function getPlatformGoogleAuth() {
  if (isMobileEnvironment()) {
    const { GoogleAuth } = await import(
      "@codetrix-studio/capacitor-google-auth"
    );
    return GoogleAuth;
  }
  return null;
}
