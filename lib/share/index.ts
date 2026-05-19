import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export async function shareImage(uri: string, filename = 'soulprofile-karne.png') {
  if (Platform.OS === 'web') {
    try {
      const link = document.createElement('a');
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('[share] web download failed', e);
    }
    return;
  }
  const can = await Sharing.isAvailableAsync();
  if (can) {
    await Sharing.shareAsync(uri, { dialogTitle: 'Galaktik Karnen', mimeType: 'image/png' });
  }
}

export async function saveImageToGallery(uri: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const perm = await MediaLibrary.requestPermissionsAsync();
  if (!perm.granted) return false;
  await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}
