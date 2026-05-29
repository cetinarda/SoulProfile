export async function startCheckout(email?: string): Promise<void> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? 'Ödeme oturumu açılamadı');
  }
  const data = (await res.json()) as { url?: string };
  if (data.url) {
    window.location.href = data.url;
  }
}
