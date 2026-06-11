'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/Link';
import { hasPremium } from '@/lib/entitlements';
import { useT } from '@/lib/i18n';

export function PromoBanner() {
  const { t } = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!hasPremium());
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/premium"
      className="block bg-gradient-to-r from-cosmicDeep via-cosmic to-nebula text-center text-[12px] font-bold tracking-wide text-white transition-opacity hover:opacity-90"
    >
      <div className="mx-auto max-w-6xl px-4 py-2">{t('free.banner')}</div>
    </Link>
  );
}
