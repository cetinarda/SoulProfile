import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.soulprofile.app',
  appName: 'SoulProfile',
  webDir: 'out',
  server: {
    // Production: dahili statik build kullanır.
    // Geliştirme: aşağıdaki satırı aç ve URL'i ver (canlı reload için).
    // url: 'http://192.168.1.X:3000',
    // cleartext: true,
    androidScheme: 'https',
    iosScheme: 'soulprofile',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#05060f',
    limitsNavigationsToAppBoundDomains: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#05060f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#f5d061',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#05060f',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
