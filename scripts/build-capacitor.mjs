#!/usr/bin/env node
// Capacitor build — Next.js static export API route'ları içeremez.
// app/api'yı geçici olarak app/_api'ya taşır (underscore prefix = private folder,
// Next routing'e dahil değil), build sonrası geri alır.

import { renameSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apiDir = join(root, 'app/api');
const hiddenDir = join(root, 'app/_api');

// ─── Submit öncesi zorunlu env kontrolü ────────────────────────────────────
// NEXT_PUBLIC_* değişkenleri BUILD ANINDA bundle'a gömülür. RevenueCat anahtarı
// build sırasında yoksa initIAP() sessizce çıkar, buyOnNative() 'IAP_NOT_READY'
// döner ve kullanıcı satın alma akışında HATA MESAJI görür.
// Bu, Guideline 2.1(b) reddinin doğrudan sebebiydi — anahtarsız binary
// App Store'a gönderilemez, o yüzden build'i burada durduruyoruz.
const REQUIRED_ENV = [
  [
    'NEXT_PUBLIC_REVENUECAT_IOS_KEY',
    'RevenueCat iOS public SDK key (appl_…). Olmadan IAP akışı hata verir → App Store 2.1(b) reddi.',
  ],
];

const missing = REQUIRED_ENV.filter(([name]) => !process.env[name]);
if (missing.length > 0 && !process.env.ALLOW_MISSING_IAP) {
  console.error('\n✗ Capacitor build durduruldu — zorunlu env değişkenleri eksik:\n');
  for (const [name, why] of missing) console.error(`    • ${name}\n      ${why}\n`);
  console.error('  Çözüm: .env dosyana ekle (veya CI secret olarak tanımla), sonra tekrar çalıştır.');
  console.error('  Yalnızca IAP\'siz yerel deneme yapıyorsan: ALLOW_MISSING_IAP=1 npm run build:ios');
  console.error('  ⚠️  ALLOW_MISSING_IAP ile üretilen binary App Store\'a GÖNDERİLEMEZ.\n');
  process.exit(1);
}

if (process.env.ALLOW_MISSING_IAP && missing.length > 0) {
  console.warn('\n⚠️  ALLOW_MISSING_IAP aktif — IAP devre dışı bir binary üretiliyor.');
  console.warn('   Bu build App Store submit için KULLANILAMAZ.\n');
}

const movedApi = existsSync(apiDir);
if (movedApi) renameSync(apiDir, hiddenDir);

let exitCode = 0;
try {
  execSync('next build', {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, BUILD_TARGET: 'capacitor', NEXT_PUBLIC_BUILD_TARGET: 'capacitor' },
  });
} catch (e) {
  exitCode = (e && typeof e === 'object' && 'status' in e ? Number(e.status) : 1) || 1;
} finally {
  if (movedApi && existsSync(hiddenDir)) {
    renameSync(hiddenDir, apiDir);
  }
}

process.exit(exitCode);
