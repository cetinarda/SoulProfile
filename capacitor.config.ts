import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.soulprofile.app',
  appName: 'SoulProfile',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'soulprofile',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#05060f',
    limitsNavigationsToAppBoundDomains: true,
    scheme: 'SoulProfile',
    preferredContentMode: 'mobile',
    scrollEnabled: true,
    handleApplicationNotifications: true,
    overrideUserAgent: undefined,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#05060f',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#f5d061',
      splashImmersive: false,
      splashFullScreen: false,
    },
    StatusBar: {
      // Default tema koyu → light ikonlar. Tema değişiminde lib/native/status-bar.ts
      // runtime'da setStyle ile günceller.
      style: 'light',
      backgroundColor: '#07091a',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    Preferences: {
      group: 'life.soulprofile.app',
    },
  },
};

export default config;
