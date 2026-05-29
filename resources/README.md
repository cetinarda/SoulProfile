# SoulProfile iOS Asset Pipeline

`scripts/prepare-ios.sh` çalıştırılırken bu dizinde **iki dosya** beklenir:

## icon.png — 1024×1024 PNG

App ikonu kaynağı. Capacitor-assets bunu kullanıp tüm boyutları (`iOS Marketing` dahil) üretecek.

Önerilen tasarım:
- `public/icon.svg` referans olarak kullanılabilir (1024 brand mark hazır)
- Figma/Sketch/Affinity'de PNG export et
- iOS gradient background veya saydam arka plan
- Apple guideline 9.3: yuvarlatılmış köşe çizmeyin — Apple kendi maskelemesini uygular

## splash.png — 2732×2732 PNG

Splash screen kaynağı. Logo merkezde, etrafta fazla boşluk olmalı (Capacitor center-crop yapar).

Önerilen:
- Koyu arka plan (#05060f — `tailwind.config.ts`'teki `bg` rengi)
- Ortada `icon.svg`'nin küçük bir versiyonu
- Bold "SOULPROFILE" altın letterspaced (Inter Bold, ~0.3em tracking)

## Üretim komutu

```bash
npx capacitor-assets generate --ios \
  --iconBackgroundColor '#05060f' \
  --splashBackgroundColor '#05060f'
```

Sonuç `ios/App/App/Assets.xcassets/` altına otomatik yazılır.

## Hızlı SVG → PNG

Figma yoksa terminal ile:
```bash
# rsvg-convert (brew install librsvg)
rsvg-convert -w 1024 -h 1024 public/icon.svg -o resources/icon.png
rsvg-convert -w 2732 -h 2732 public/icon.svg -o resources/splash.png
```
