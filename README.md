# SoulProfile

> Sen sadece insan değilsin — galaktik bir karnen var.

Doğum bilgilerinden astroloji + Human Design + numeroloji + yıldız ırkı kökeni
içeren **Galaktik Karne** üreten web + iOS uygulaması. Karne profil fotoğrafına
basılır, görsel olarak indirilebilir veya Instagram story formatında paylaşılabilir.

## Özellikler (MVP)

- ✦ **Yıldız Kökeni:** Pleiadyalı, Siryan, Arkturian, Andromedan, Lyran, Orion,
  Venüsyen, Hadarian, Mintakan, Galaktik Federasyon Elçisi arketipleri.
- 🌙 **Astroloji:** Güneş, Ay, Yükselen, 10 gezegen, Kuzey/Güney Ay Düğümü, 12 ev.
- ◇ **Human Design:** Tip, Strateji, Otorite, Profil, Enkarnasyon Kapısı, tanımlı merkezler.
- ⌖ **Numeroloji:** Yaşam Yolu (master numbers dahil), İfade, Ruh Arzusu, Kişisel Yıl.
- ☼ **3 Görev:** Kuzey Düğüm + Yaşam Yolu + Human Design'dan sentezlenmiş çağrı.
- 📸 **Karne görseli:** 9:16 storyformat, fotoğraflı, paylaşılabilir + galeriye kaydedilebilir.
- 💎 **Premium teaser:** Haftalık/aylık döngüsel karneler (yakında).

## Teknoloji

- **Expo SDK 52** (React Native + Web tek kod tabanı)
- **Expo Router** (file-based routing, typed routes)
- **astronomy-engine** (saf JS gezegen efemerisi — iOS + Web)
- **Custom Human Design engine** (64 kapı, 36 kanal, 9 merkez)
- **Supabase** (auth, profiles, reports, subscriptions, RLS)
- **Anthropic Claude API** (kişiselleştirilmiş anlatım üretimi, fallback'li)
- **expo-image-picker + react-native-view-shot** (fotoğraf + karne PNG export)
- **expo-sharing + expo-media-library** (paylaş + galeriye kaydet)
- **Zustand** (state)

## Hızlı başlangıç

```bash
npm install
cp .env.example .env  # Supabase + Anthropic key'leri ekle
npm run web           # tarayıcıda
npm run ios           # iOS Simulator (Xcode kurulu olmalı)
```

Detay: [docs/SETUP.md](docs/SETUP.md)

## Proje yapısı

```
app/                  # Expo Router ekranları
  _layout.tsx
  index.tsx           # Welcome
  birth.tsx           # Doğum formu (fotoğraf, geocoding)
  report.tsx          # Karne + paylaş/indir
components/
  CosmicBackground.tsx
  ReportCard.tsx      # 9:16 paylaşılabilir karne görseli
lib/
  astrology/          # astronomy-engine wrapper, ASC/MC, NN/SN
  human-design/       # 64 gates, channels, type/authority logic
  numerology/         # life path, expression, personal year
  galactic/           # star race archetypes
  missions/           # 3 mission synthesis
  narrative/          # Claude API + fallback
  report/             # orchestrator
  content/            # numerology, astrology, chakra, glossary
  biorhythm/          # 3-cycle biorhythm
  geocoding/          # open-meteo public API
  share/              # cross-platform share/save
  supabase/           # client
  store.ts            # zustand
  theme.ts
  types.ts
supabase/
  migrations/0001_init.sql
marketing/
  GO_TO_MARKET.md
  CONTENT_CALENDAR.md
  BRAND_BIBLE.md       (agent üretiyor)
  INFLUENCER_OUTREACH.md (agent üretiyor)
  ASO_AND_PAID.md      (agent üretiyor)
docs/
  SETUP.md
  PREMIUM_ROADMAP.md
```

## Lisans

Tüm hakları saklıdır. © SoulProfile.
