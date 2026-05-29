import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.soulprofile.app',
  appName: 'SoulProfile',
  webDir: 'out',
  bundledWebRuntime: false,
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
      style: 'dark',
      backgroundColor: '#05060f',
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
