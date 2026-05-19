import 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../lib/theme';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    CormorantGaramond: require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {Platform.OS === 'web' ? (
          <ScrollView style={styles.webScroll} contentContainerStyle={styles.webContent}>
            <TopBar />
            <View style={styles.webMain}>
              <Slot />
            </View>
            <Footer />
          </ScrollView>
        ) : (
          <Slot />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webScroll: { flex: 1, backgroundColor: colors.bg },
  webContent: { minHeight: '100%' as never },
  webMain: { flex: 1 },
});
