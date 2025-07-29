import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.target.mobile",
  appName: "Target Mobile",
  webDir: "dist/spa",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#7c3aed",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      overlaysWebView: true,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "966058326327-vqqh1rgur3fv14drtb0m2gdv0bnb8kbi.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
