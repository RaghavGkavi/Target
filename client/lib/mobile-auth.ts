/**
 * Initialize Google Auth for mobile platforms
 */
export async function initializeMobileGoogleAuth(): Promise<void> {
  try {
    // Check if we're in a mobile environment
    const isMobile = import.meta.env.VITE_MOBILE === "true" ||
                    (typeof window !== "undefined" && window.location.protocol === "capacitor:");

    if (isMobile) {
      // Dynamically import the Google Auth plugin only in mobile environment
      const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");

      await GoogleAuth.initialize({
        clientId: "966058326327-vqqh1rgur3fv14drtb0m2gdv0bnb8kbi.apps.googleusercontent.com",
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
 * Check if we're running in a mobile environment
 */
export function isMobileEnvironment(): boolean {
  return import.meta.env.VITE_MOBILE === "true" || 
         (typeof window !== "undefined" && window.location.protocol === "capacitor:");
}

/**
 * Get the platform-specific Google Auth implementation
 */
export async function getPlatformGoogleAuth() {
  if (isMobileEnvironment()) {
    return GoogleAuth;
  }
  return null;
}
