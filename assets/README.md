# Assets

Bu dizine eklenmesi gereken dosyalar:

- `icon.png` — 1024x1024 uygulama ikonu (lacivert/galaktik tema)
- `splash.png` — 1284x2778 splash görseli (koyu fon, gold logo)
- `adaptive-icon.png` — 1024x1024 Android adaptive icon foreground
- `favicon.png` — 48x48 web favicon
- `fonts/Inter-Regular.ttf` — https://rsms.me/inter/
- `fonts/Inter-Bold.ttf`
- `fonts/CormorantGaramond-SemiBold.ttf` — https://fonts.google.com/specimen/Cormorant+Garamond

Geçici çözüm: Bu dosyalar olmadan Expo ilk açılışta hata verir. `npx expo install expo-asset` ardından `expo prebuild` öncesi yer tutucu görseller koyabilirsin (örneğin Figma'dan export veya online ücretsiz icon generator).
