# SoulProfile — Çalışma Notları

> Bu dosya bu repoda gelecek tüm Claude oturumları için referanstır.
> Önce buraya bak.

## Yığın

- **Expo SDK 52** (React Native + Web, tek kod tabanı)
- **Expo Router v4** (file-based, typed routes)
- **astronomy-engine** (saf JS — `sweph` veya native binding YOK, iOS + Web sorunsuz)
- **Supabase** (auth + Postgres + RLS; EU bölgesi tercih)
- **Anthropic Claude API** — model: `claude-sonnet-4-6`. `claude-haiku-4-5-20251001` ucuz kısımlar için.
- **RevenueCat + Stripe** (iOS abonelik + web ödeme)
- **expo-image-picker + react-native-view-shot + expo-sharing + expo-media-library**
- **Zustand** (state, persist gerekirse `zustand/middleware`)

## Yapı

```
app/                  # Expo Router ekranları + yasal sayfalar
components/           # CosmicBackground, ReportCard, TopBar, Footer, PageLayout
lib/
  astrology/          # gezegen pozisyonları, ASC/MC, Kuzey/Güney Düğüm
  human-design/       # 64 kapı, 36 kanal, 9 merkez, tip/otorite/profil
  numerology/         # life path (master sayılarla), personal year, expression
  galactic/           # yıldız ırkı arketipi seçimi
  missions/           # 3 görev sentezi
  narrative/          # Claude prompt + fallback
  report/             # tüm modülleri orkestre eden builder
  content/            # numeroloji/astroloji/çakra/sözlük metinleri (TR)
  biorhythm/          # 23/28/33 günlük döngüler
  geocoding/          # Open-Meteo (anahtar gerektirmez)
  share/              # cross-platform paylaş + galeriye kaydet
  supabase/           # client (RN + Web ortak)
  store.ts            # zustand
  theme.ts, types.ts
supabase/migrations/  # 0001_init.sql
marketing/            # GTM, içerik takvimi, brand bible, ASO+paid, influencer
docs/                 # SETUP.md, PREMIUM_ROADMAP.md
```

## Yeni bir uygulama açtığımızda KAÇIRMA

Bu liste, bir tüketici uygulaması yapılırken HER ZAMAN baştan kurulması gerekenler:

### 1. Web + Mobile parite
- [ ] Expo (RN + Web) ile başla, ayrı kod tabanı yapma (zorunlu olmadıkça)
- [ ] `TopBar` ve `Footer` sadece `Platform.OS === 'web'` koşuluyla render
- [ ] `app/_layout.tsx` web'de `ScrollView` sarar, mobilde doğrudan `Slot`
- [ ] `PageLayout` ortak şablon — kicker + title + intro + body, max-width 760px

### 2. Top navigation (web)
- Sticky header (`position: 'sticky'`, `backdropFilter: blur`)
- Soldan brand logo, ortada nav linkler, sağda CTA butonu
- `< 820px`'de hamburger veya kompakt mod
- Linkler: Ana Sayfa, Karne/Ürün, Premium, Kavramlar/Blog, Hakkımızda, Giriş

### 3. Footer (web)
- 3 sütun: Ürün · Kurum · Yasal
- Brand sütunu + tagline + DISCLAIMER (tıbbi tavsiye değildir uyarısı)
- Bottom row: copyright + custom satır

### 4. App Store / Play Store zorunluları (HEMEN üret)
- [ ] `/privacy` — Gizlilik Politikası (KVKK + GDPR maddeleri dahil)
- [ ] `/terms` — Kullanım Koşulları
- [ ] `/support` — SSS + iletişim
- [ ] `/contact` — İletişim
- [ ] `/about` — Hakkımızda
- [ ] `/cookie` — Çerez politikası (web için)
- [ ] `/data` — KVKK/GDPR veri hakları + talep akışı
- [ ] `app.json` içinde:
  - `infoPlist` izin açıklamaları (kamera, foto, konum)
  - `bundleIdentifier`, `buildNumber`, `versionCode`
  - `ITSAppUsesNonExemptEncryption: false`

### 5. Yasal disclaimer
Spiritüel / sağlık / finans uygulamalarında MUTLAKA:
- "Eğlence ve farkındalık amaçlıdır. Tıbbi/psikolojik/finansal tavsiye yerine geçmez."
- Karne görseli alt köşesinde + footer'da + ToS içinde 3 yerde tekrarla

### 6. Hassas veri ele alımı
- Doğum tarihi, saati, yeri = hassas veri
- 16 yaş altı yasak (App Store + KVKK)
- Hesap silme akışı (Profile → Delete) MUST HAVE
- JSON export (data portability) MUST HAVE
- Şifreli depolama (Supabase varsayılan)

### 7. Deploy (Netlify)
- `netlify.toml` ekle, `NODE_VERSION = "20"` sabitle
- Node 22 default ise `node_modules` içindeki TS dosyaları için strip-types
  hatası alırsın — Node 20'ye düş
- `--no-experimental-strip-types` Node 20'de YOK ve Netlify yasaklar — koyma
- SPA redirect kuralı koy (`/*  →  /index.html  200`)
- `NPM_FLAGS = "--legacy-peer-deps"` Expo'da peer çakışmaları için

### 8. AI / Claude entegrasyonu
- API key'i client'ta tutma! İlk MVP için `dangerouslyAllowBrowser: true` olur
  ama prod'a çıkmadan Supabase Edge Function'a taşı
- Prompt caching kullan (system + büyük static context cache'lenir)
- Fallback narrative her zaman olsun (Claude down olunca)
- Model: `claude-sonnet-4-6` (kaliteli), `claude-haiku-4-5-20251001` (ucuz)

### 9. Paylaşılabilir görsel (viral mekanik)
- 9:16 storyformat (1080×1920) için ReportCard
- `react-native-view-shot` ile `captureRef` → PNG
- iOS: `expo-sharing` + `expo-media-library`
- Web: programatik `<a download>` ile PNG indir
- Görselin alt köşesine her zaman URL/QR koy → organik geri akış

### 10. Marketing dokümanları (göz ardı etme)
Her tüketici uygulaması için `marketing/` altına:
- `GO_TO_MARKET.md` — pazar fazları, viral mekanik, KPI
- `BRAND_BIBLE.md` — voice, persona, paleti, manifesto (TR + EN)
- `ASO_AND_PAID.md` — App Store metadata + ASA/TikTok/Meta playbook
- `INFLUENCER_OUTREACH.md` — hesap listesi + email şablonları + affiliate
- `CONTENT_CALENDAR.md` — 30 günlük post planı

### 11. Localization (i18n)
- TR ana dil; EN, ES, PT-BR, DE, FR ileride
- İçerikleri `lib/content/` altında `*-tr.ts`, `*-en.ts` olarak ayır
- Tek bir `useLocale()` hook'undan oku

### 12. Test edilecek minimum senaryolar
- [ ] Doğum saati bilinmeyen kullanıcı
- [ ] Yurt dışı doğum (timezone otomatik gelmeli)
- [ ] Master numara (11, 22, 33) düşmemeli
- [ ] iOS / web aynı kullanıcı için aynı sonuç
- [ ] Karne PNG export (iOS + web)
- [ ] Paylaş sheet açılıyor mu (iOS)
- [ ] Hesap silme akışı çalışıyor mu

## Hatalar ve Çözümler

| Hata | Çözüm |
|---|---|
| `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` | Node 20'ye düş (`.nvmrc` + `netlify.toml`) |
| `--no-experimental-strip-types is not allowed` | NODE_OPTIONS'tan kaldır (Node 20'de zaten yok) |
| Expo peer dependency çakışması | `NPM_FLAGS = "--legacy-peer-deps"` |
| `sweph` / native bağımlılık web'de patlıyor | Saf JS alternatif kullan (`astronomy-engine`) |
| Anthropic SDK browser'da reddediyor | `dangerouslyAllowBrowser: true` (sadece MVP), prod'da Edge Function |

## Branş kuralı

Bu repoda geliştirme branch'i: `claude/cosmic-birth-chart-app-DW89I`.
Tüm commit ve push'lar bu branş'a.
