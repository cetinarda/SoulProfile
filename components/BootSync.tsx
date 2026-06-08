'use client';

import { useEffect } from 'react';
import { isCacheStale, refreshEntitlement } from '@/lib/entitlements';
import { initDeepLink } from '@/lib/native/deep-link';

/**
 * App boot — entitlement Supabase'ten senkron + iOS deep link handler.
 * Görsel render'a engel olmamak için fire-and-forget.
 */
export function BootSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isCacheStale()) {
      refreshEntitlement().catch(() => {
        /* offline veya supabase yok → mevcut cache devam */
      });
    }
    initDeepLink().catch(() => {
      /* web ortamı veya Capacitor yok */
    });
  }, []);
  return null;
}
