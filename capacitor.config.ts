/// <reference types="@capacitor/cli" />

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.elartedelopossible.app",
  appName: "El Arte de lo Posible",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      backgroundColor: "#0f172a",
      style: "DARK",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
    },
  },
};

export default config;
