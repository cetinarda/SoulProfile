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

const movedApi = existsSync(apiDir);
if (movedApi) renameSync(apiDir, hiddenDir);

let exitCode = 0;
try {
  execSync('next build', {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, BUILD_TARGET: 'capacitor' },
  });
} catch (e) {
  exitCode = (e && typeof e === 'object' && 'status' in e ? Number(e.status) : 1) || 1;
} finally {
  if (movedApi && existsSync(hiddenDir)) {
    renameSync(hiddenDir, apiDir);
  }
}

process.exit(exitCode);
