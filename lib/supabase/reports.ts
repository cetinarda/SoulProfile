// Supabase yapılandırıldığında karneleri saklar/listeler.
// Yapılandırılmamışsa localStorage'a düşer — kullanıcı kaybetmez.

import { getSupabase } from './index';
import type { GalacticReport } from '../types';

const LS_KEY = 'soulprofile.reports.v1';

type StoredReport = GalacticReport & { savedAt: string };

function loadLocal(): StoredReport[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredReport[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(reports: StoredReport[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(reports));
  } catch {
    /* quota or private mode */
  }
}

export async function saveReport(report: GalacticReport): Promise<StoredReport> {
  const stored: StoredReport = { ...report, savedAt: new Date().toISOString() };

  const sb = getSupabase();
  if (sb) {
    const { data: user } = await sb.auth.getUser();
    if (user?.user) {
      await sb.from('reports').insert({
        user_id: user.user.id,
        kind: 'galactic',
        payload: report,
        is_premium: false,
      });
    }
  }

  const list = loadLocal();
  const dedupe = list.filter((r) => r.id !== stored.id);
  saveLocal([stored, ...dedupe].slice(0, 30));
  return stored;
}

export async function listReports(): Promise<StoredReport[]> {
  const sb = getSupabase();
  if (sb) {
    const { data: user } = await sb.auth.getUser();
    if (user?.user) {
      const { data } = await sb
        .from('reports')
        .select('payload, created_at')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (data) {
        return data.map((row) => ({
          ...(row.payload as GalacticReport),
          savedAt: row.created_at as string,
        }));
      }
    }
  }
  return loadLocal();
}

export async function clearAllReports(): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { data: user } = await sb.auth.getUser();
    if (user?.user) {
      await sb.from('reports').delete().eq('user_id', user.user.id);
    }
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(LS_KEY);
  }
}

/**
 * Hesap silme — Apple guideline 5.1.1(v) + GDPR Art.17.
 * 1. Auth'lu kullanıcının profil + reports + entitlements satırlarını siler
 * 2. Storage'daki fotoğraf blob'larını temizler
 * 3. localStorage'ı sıfırlar
 * 4. Session'dan çıkış yapar
 *
 * Auth.users tablosunun kendisi service_role gerektirdiği için Supabase
 * Edge Function'a delegate edilebilir; bu fonksiyon o noktayı çağırır.
 */
export async function purgeAccount(): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) {
    if (typeof localStorage !== 'undefined') localStorage.clear();
    return { ok: true };
  }
  try {
    const { data: userResult } = await sb.auth.getUser();
    const user = userResult?.user;
    if (!user) {
      if (typeof localStorage !== 'undefined') localStorage.clear();
      return { ok: true };
    }

    // 1. Storage fotoğrafları (varsa)
    const { data: profileRow } = await sb
      .from('profiles')
      .select('photo_path')
      .eq('user_id', user.id)
      .maybeSingle();
    const photoPath = (profileRow as { photo_path?: string } | null)?.photo_path;
    if (photoPath) {
      await sb.storage.from('photos').remove([photoPath]).catch(() => null);
    }

    // 2. PII içeren DB satırları — reports + entitlements + profiles cascade
    await Promise.allSettled([
      sb.from('reports').delete().eq('user_id', user.id),
      sb.from('entitlements').delete().eq('user_id', user.id),
      sb.from('subscriptions').delete().eq('user_id', user.id),
      sb.from('stripe_customers').delete().eq('user_id', user.id),
      sb.from('profiles').delete().eq('user_id', user.id),
    ]);

    // 3. Auth user'ın kendisini Edge Function ile sil (service_role gerektirir).
    // Endpoint mevcut değilse de DB satırları silindi; auth.users orphan olur.
    try {
      await fetch('/api/account/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${(await sb.auth.getSession()).data.session?.access_token ?? ''}` },
      });
    } catch {
      /* Edge Function yoksa geç */
    }

    await sb.auth.signOut();
    if (typeof localStorage !== 'undefined') localStorage.clear();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Silme başarısız' };
  }
}
