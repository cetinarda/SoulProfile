# SoulProfile — Çalışma Notları

> Bu dosya bu repoda gelecek tüm Claude oturumları için referanstır.
> Önce buraya bak.

## Yığın (web-first, MVP)

- **Next.js 14.2.35** App Router (Netlify ile resmi plugin)
- **React 18.3 + TypeScript**
- **Tailwind CSS v3** + özel `galaxy` / `cosmic` / `aurora` gradyanları
- **astronomy-engine** (saf JS, native binding YOK)
- **html-to-image** karne PNG export
- **Supabase** auth + Postgres + RLS (EU bölgesi)
- **Anthropic Claude API** model: `claude-sonnet-4-6`
- **Zustand** state

> Önceki deneme Expo (RN + Web) ile yapılmıştı — Netlify deploy'unda Expo
> Web'in transitive dep çatışmaları (webpack vs metro, @babel/preset-env vb.)
> sürekli patladı. Pure JS Next.js'e geçtik. iOS uygulaması ileride ayrı
> workspace olarak eklenir; tüm `lib/` paylaşımlıdır.

## Yapı

```
app/                  # Next.js App Router sayfaları
  layout.tsx          # TopBar + Footer
  page.tsx            # Welcome
  birth/page.tsx
  report/page.tsx
  privacy/, terms/, cookie/, data/, support/, contact/, about/, glossary/, premium/
components/
  TopBar.tsx, Footer.tsx, CosmicBackground.tsx, ReportCard.tsx, PageLayout.tsx
lib/
  astrology/, numerology/, human-design/, galactic/, missions/, narrative/,
  biorhythm/, geocoding/, share/, supabase/, content/, report/,
  store.ts, theme.ts, types.ts
supabase/migrations/  # 0001_init.sql
marketing/            # GTM, Brand Bible, ASO+Paid, Influencer Outreach, Content Calendar
docs/                 # SETUP, PREMIUM_ROADMAP
```

## Yeni bir uygulama açtığımızda KAÇIRMA

### 1. Yığın seçimi
- **Web-first deploy hedefliyorsan:** Next.js + Tailwind + React → Netlify auto-detect
- **iOS + Web isteğin varsa ve Netlify deploy şartsa:** Önce Next.js (web), sonra ayrı Expo workspace (mobile). Aynı `lib/` paylaşılır.
- **Expo Web + Netlify YAPMA:** Transitive dep çatışmaları (`@babel/preset-env`, `webpack` lockfile mismatch) sürekli patlar.

### 2. Netlify deploy gereksinimleri
- `netlify.toml` ekle:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"
  [build.environment]
    NODE_VERSION = "20"
    NEXT_TELEMETRY_DISABLED = "1"
  [[plugins]]
    package = "@netlify/plugin-nextjs"
  ```
- `.nvmrc` ile Node 20 sabitle
- `package-lock.json` `npm install`'tan SONRA üret (NOT `--package-lock-only`); commit et
- `npm ci` yerine `npm install` veya Netlify'ın pre-install'una güven

### 3. Web navigation + zorunlu sayfalar (App Store + Play Store + GDPR)
Her tüketici uygulaması için BAŞTAN kur:
- TopBar (sticky, backdrop-blur, logo + nav + CTA)
- Footer (3 sütun: Ürün / Kurum / Yasal + brand col + disclaimer)
- Sayfalar:
  - `/privacy` — Gizlilik (KVKK + GDPR)
  - `/terms` — Kullanım Koşulları
  - `/support` — SSS + iletişim
  - `/contact` — E-posta + sosyal + adres
  - `/about` — Hakkımızda
  - `/cookie` — Çerez politikası
  - `/data` — KVKK/GDPR veri hakları
  - `/glossary` — Kavramlar sözlüğü

### 4. Yasal disclaimer
Spiritüel/sağlık/finans kategorisinde MUTLAKA:
> "Eğlence ve farkındalık amaçlıdır. Tıbbi/psikolojik/finansal tavsiye yerine geçmez."

Footer, karne görseli alt köşesi, ToS — 3 yerde tekrar.

### 5. Hassas veri ele alımı
- Doğum tarihi/saati/yeri = hassas (App Store + KVKK + GDPR)
- 16 yaş altı yasak
- Hesap silme akışı MUST HAVE
- JSON export (data portability) MUST HAVE

### 6. AI / Claude entegrasyonu
- MVP için `dangerouslyAllowBrowser: true` kullanılabilir
- Prod'a çıkmadan API key'i Supabase Edge Function arkasına taşı
- Fallback narrative her zaman olsun
- Model: `claude-sonnet-4-6`. Ucuz için `claude-haiku-4-5-20251001`

### 7. Paylaşılabilir görsel (viral mekanik)
- 9:16 storyformat (1080×1920 hedef)
- Web: `html-to-image` `toPng()` + Web Share API + fallback download
- iOS: `react-native-view-shot` + `expo-sharing` + `expo-media-library`
- Görselin alt köşesine her zaman URL koy → organik geri akış

### 8. Marketing dokümanları
Her tüketici uygulaması için `marketing/` altına:
- `GO_TO_MARKET.md` — pazar fazları, viral mekanik, KPI
- `BRAND_BIBLE.md` — voice, persona, palet, manifesto (TR + EN)
- `ASO_AND_PAID.md` — App Store metadata + ASA/TikTok/Meta playbook
- `INFLUENCER_OUTREACH.md` — hesap listesi + email şablonları + affiliate
- `CONTENT_CALENDAR.md` — 30 günlük post planı

### 9. Test edilecek minimum senaryolar
- Doğum saati bilinmeyen kullanıcı
- Yurt dışı doğum (timezone otomatik gelmeli)
- Master numara (11/22/33) düşmemeli
- Karne PNG export çalışıyor (html-to-image quirk: external image CORS dikkat)
- Mobile responsive (özellikle TopBar hamburger)
- Hesap silme akışı

## Hatalar ve Çözümler

| Hata | Çözüm |
|---|---|
| `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` | Node 20'ye düş (`.nvmrc` + `netlify.toml`) |
| `--no-experimental-strip-types is not allowed` | Node 20'de yok, NODE_OPTIONS'tan kaldır |
| `npm ci` lockfile mismatch | Tam `npm install` ile lockfile üret, `--package-lock-only` KULLANMA |
| Expo peer dep çakışması | Next.js'e geç, Expo'yu mobile-only workspace yap |
| `sweph` native binding web'de patlıyor | `astronomy-engine` (saf JS) |
| Anthropic SDK browser reddediyor | `dangerouslyAllowBrowser: true` (MVP) |
| Tailwind class'lar build'de uçuyor | `tailwind.config.ts` content array'inde `lib/**/*.tsx` de olmalı |

## Branş kuralı

Bu repoda geliştirme branch'i: `claude/cosmic-birth-chart-app-DW89I`.
Tüm commit ve push'lar bu branş'a.
