'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageLayout, Section, Bullet } from '@/components/PageLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MotionToggle } from '@/components/MotionToggle';
import { useSoulStore } from '@/lib/store';

export default function Settings() {
  const router = useRouter();
  const report = useSoulStore((s) => s.report);
  const reset = useSoulStore((s) => s.reset);
  const [confirming, setConfirming] = useState(false);

  function exportData() {
    if (!report) {
      alert('Henüz veri yok.');
      return;
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soulprofile-${report.birth.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function deleteData() {
    reset();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    setConfirming(false);
    router.replace('/');
  }

  return (
    <PageLayout
      kicker="AYARLAR"
      title="Verin senin kontrolünde"
      intro="Karneni indir, hesabını sil, abonelikleri yönet. Tüm hakların KVKK + GDPR çerçevesinde korunur."
    >
      <Section heading="Görünüm">
        <p>Uygulamanın temasını seç. "Sistem" cihazının ayarına uyar.</p>
        <div className="mt-2">
          <ThemeToggle />
        </div>
      </Section>

      <Section heading="Erişilebilirlik · Hareket">
        <p>
          Animasyonları azaltmak gözünü yorduğun an hayatını kolaylaştırır. Cihazın
          ayarını okuyabiliriz; istersen elle de seçebilirsin.
        </p>
        <div className="mt-2">
          <MotionToggle />
        </div>
      </Section>

      <Section heading="Verilerini İndir">
        <p>
          Karneni JSON formatında indir. İçeriğinde tüm sistemlerden çıkan değerler ve AI
          anlatın bulunur. Bu dosya başka bir hizmete taşımak veya saklamak için kullanılabilir.
        </p>
        <button
          type="button"
          onClick={exportData}
          className="mt-2 inline-block rounded-full border border-gold/50 px-5 py-2 text-sm font-bold text-gold hover:bg-gold/10"
        >
          ⬇ JSON İndir
        </button>
      </Section>

      <Section heading="Verilerini Sil">
        <p>
          Bu cihazdaki tüm SoulProfile verisi (karne, oturum, tercih) silinir. Geri alınamaz.
          Hesap özelliği geldiğinde sunucudaki kayıtların da bu adımla silinecek.
        </p>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-2 inline-block rounded-full border border-danger/50 px-5 py-2 text-sm font-bold text-danger hover:bg-danger/10"
          >
            ✕ Hesabımı / Verimi Sil
          </button>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={deleteData}
              className="rounded-full bg-danger px-5 py-2 text-sm font-bold text-white"
            >
              Evet, sil
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-full border border-panelBorder px-5 py-2 text-sm text-muted"
            >
              Vazgeç
            </button>
          </div>
        )}
      </Section>

      <Section heading="Abonelik Yönetimi">
        <Bullet>
          iOS: Ayarlar → Apple ID → Abonelikler → SoulProfile
        </Bullet>
        <Bullet>
          Web (Stripe): Yakında bu sayfada "müşteri portalı" linki çıkacak. O sırada
          support@soulprofile.life adresine yaz, ekibimiz seninle ilgilenir.
        </Bullet>
      </Section>

      <Section heading="Gizliliğin">
        <p>
          Hangi verileri topladığımız, nasıl sakladığımız ve haklarının tamamı{' '}
          <a className="text-gold underline" href="/privacy">Gizlilik Politikası</a> ve{' '}
          <a className="text-gold underline" href="/data">Veri Hakları</a> sayfalarında.
        </p>
      </Section>
    </PageLayout>
  );
}
