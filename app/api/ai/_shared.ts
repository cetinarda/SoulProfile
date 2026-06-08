// Ortak Edge helper — Anthropic istemcisi, CORS, basit auth gate.
// Tüm /api/ai/* route'ları buradan tüketir.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const CORS_HEADERS: Record<string, string> = {
  // Capacitor iOS app origin'i (soulprofile:// + capacitor://) ve web origin'i için.
  // CSP zaten frame-ancestors none ile clickjacking'i kapatıyor.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function corsResponse(body: unknown, init: ResponseInit = {}): Response {
  const res = NextResponse.json(body, init);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  // Edge runtime'da çalışır — dangerouslyAllowBrowser yok, gerek yok.
  return new Anthropic({ apiKey: key });
}

/**
 * Çağrı kaynağını teşhis et — entitlement kontrolü için kullanılır.
 * Authorization: Bearer <jwt> formatında supabase access token bekler.
 */
export type CallerIdentity = {
  userId: string | null;
  jwt: string | null;
};

export function readCaller(request: Request): CallerIdentity {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return { userId: null, jwt: null };
  const jwt = auth.slice(7);
  // JWT payload (middle segment) base64url decode — supabase ID
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return { userId: null, jwt };
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/'))) as {
      sub?: string;
      exp?: number;
    };
    if (!payload.sub) return { userId: null, jwt };
    if (payload.exp && payload.exp * 1000 < Date.now()) return { userId: null, jwt };
    return { userId: payload.sub, jwt };
  } catch {
    return { userId: null, jwt };
  }
}

/**
 * Verilen Supabase user_id için aktif 'premium' entitlement var mı?
 * Webhook'lar bu satırı yazar; deep-analysis route'u burayı sorar.
 */
export async function hasPremium(userId: string): Promise<boolean> {
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl || !supaServiceKey) return false;

  const url = `${supaUrl}/rest/v1/entitlements?user_id=eq.${encodeURIComponent(userId)}&entitlement=eq.premium&active=eq.true&select=expires_at&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: supaServiceKey,
      Authorization: `Bearer ${supaServiceKey}`,
    },
  });
  if (!res.ok) return false;
  const rows = (await res.json()) as Array<{ expires_at?: string | null }>;
  if (rows.length === 0) return false;
  const row = rows[0]!;
  if (!row.expires_at) return true;
  return new Date(row.expires_at).getTime() > Date.now();
}

/** Sade in-memory token-bucket: Edge isolate-bound, garanti vermez. */
const bucket = new Map<string, { tokens: number; refilledAt: number }>();

export function rateLimit(key: string, perMin = 10): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const refillRate = perMin / 60_000; // tokens per ms
  const entry = bucket.get(key) ?? { tokens: perMin, refilledAt: now };
  const refilled = Math.min(perMin, entry.tokens + (now - entry.refilledAt) * refillRate);
  if (refilled < 1) {
    const retryAfter = Math.ceil((1 - refilled) / refillRate / 1000);
    bucket.set(key, { tokens: refilled, refilledAt: now });
    return { ok: false, retryAfter };
  }
  bucket.set(key, { tokens: refilled - 1, refilledAt: now });
  return { ok: true };
}

export function rateKey(request: Request, prefix: string): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'anon';
  return `${prefix}:${ip}`;
}
