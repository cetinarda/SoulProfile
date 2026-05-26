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
