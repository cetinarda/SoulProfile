#!/usr/bin/env node
/**
 * iOS Info.plist yamacı — `npx cap sync` SONRASI çalışır (npm scriptlerine bağlı).
 *
 * NEDEN VAR:
 *   `npx cap add ios` temiz bir Info.plist üretir; Apple'ın zorunlu privacy
 *   "usage description" anahtarları OTOMATİK gelmez. `NSCameraUsageDescription`
 *   eksikken kullanıcı "Take Photo" dediğinde iOS uygulamayı ANINDA öldürür
 *   (error değil, native crash). App Store reddi: Guideline 2.1(a).
 *   Bu script eksik anahtarları idempotent şekilde ekleyerek crash'i kökten keser.
 *
 * KULLANIM:
 *   node scripts/ios-plist-patch.mjs        (npm run cap:sync / cap:ios otomatik çağırır)
 *
 * GÜVENLİ: sadece EKSİK anahtarları ekler; var olanlara dokunmaz. Tekrar tekrar
 * çalıştırılabilir (ikinci çalıştırmada "değişiklik yok" der).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const PLIST = 'ios/App/App/Info.plist';

// Apple zorunlu privacy purpose string'leri (kamera/galeri crash'ini önler)
const STRING_KEYS = [
  [
    'NSCameraUsageDescription',
    'Karnen için anlık bir profil fotoğrafı çekmek istersen kameran gerekiyor. İstemezsen bu adımı atlayabilirsin.',
  ],
  [
    'NSPhotoLibraryUsageDescription',
    'Profil fotoğrafını galaktik karnenin üzerine basmak için galerin gerekiyor. Fotoğraf cihazında kalır, hiçbir sunucuya yüklenmez.',
  ],
  [
    'NSPhotoLibraryAddUsageDescription',
    'Hazırladığın paylaşılabilir karneyi cihazına PNG olarak kaydetmek için galeri yazma izni gerekiyor.',
  ],
];

// Export compliance — her build'de manuel "encryption var mı" sorusunu keser
const BOOL_KEYS = [['ITSAppUsesNonExemptEncryption', false]];

function hasKey(xml, name) {
  return new RegExp(`<key>\\s*${name}\\s*</key>`).test(xml);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function insertBeforeRootDictClose(xml, block) {
  // Kök <dict>'in kapanışı dosyadaki SON </dict>'tir (iç içe dict'ler daha önce kapanır).
  const idx = xml.lastIndexOf('</dict>');
  if (idx === -1) throw new Error('Geçersiz Info.plist: </dict> bulunamadı.');
  return xml.slice(0, idx) + block + xml.slice(idx);
}

function main() {
  if (!existsSync(PLIST)) {
    console.error(`✗ ${PLIST} yok. Önce native projeyi üret:  npm run cap:add:ios`);
    process.exit(1);
  }

  let xml = readFileSync(PLIST, 'utf8');
  const added = [];

  for (const [name, value] of STRING_KEYS) {
    if (hasKey(xml, name)) continue;
    xml = insertBeforeRootDictClose(xml, `\t<key>${name}</key>\n\t<string>${escapeXml(value)}</string>\n`);
    added.push(name);
  }

  for (const [name, value] of BOOL_KEYS) {
    if (hasKey(xml, name)) continue;
    xml = insertBeforeRootDictClose(xml, `\t<key>${name}</key>\n\t<${value}/>\n`);
    added.push(name);
  }

  if (added.length === 0) {
    console.log('✓ Info.plist zaten tüm zorunlu anahtarları içeriyor — değişiklik yok.');
    return;
  }

  writeFileSync(PLIST, xml, 'utf8');
  console.log('✓ Info.plist yamandı. Eklenen anahtarlar:');
  for (const k of added) console.log(`    • ${k}`);
  console.log('\n  Sonraki adım: Xcode → build numarasını artır → Archive → Upload.');
}

main();
