import Link from 'next/link';
import { CosmicBackground } from '@/components/CosmicBackground';

const STEPS = [
  {
    n: '01',
    icon: '📅',
    title: 'Doğum Bilgini Gir',
    desc: 'Adın, doğum tarihin, saatin ve yerin — istersen profil fotoğrafın. 60 saniye sürer.',
  },
  {
    n: '02',
    icon: '✶',
    title: '9 Sistem Aynı Anda Hesaplanır',
    desc: 'Astronomik harita, Human Design, numeroloji, Vedik, Maya, Çin, Norse, Tarot, yıldız ırkı.',
  },
  {
    n: '03',
    icon: '✦',
    title: 'Kozmik Kimliğin Tek Karnede',
    desc: '3D solar sistem, karakter stat kartı, AI anlatın, paylaşılabilir görsel — hepsi senin.',
  },
];

const SYSTEMS = [
  { emoji: '🌞', title: 'Batı Astrolojisi', desc: 'Güneş, Ay, Yükselen + Kuzey/Güney Düğüm' },
  { emoji: '◇', title: 'Human Design', desc: 'Tip, otorite, profil, strateji, beden grafiği' },
  { emoji: '⌖', title: 'Numeroloji', desc: 'Yaşam Yolu, master sayılar, Kişisel Yıl' },
  { emoji: '🪷', title: 'Vedik Nakshatra', desc: 'Ay\'ın 27 yıldız evi + pada' },
  { emoji: '🦋', title: 'Maya Tzolkin', desc: 'Kin numarası, gün mührü, galaktik ton' },
  { emoji: '🐉', title: 'Çin Zodyak', desc: '12 hayvan × 5 element × Yin/Yang' },
  { emoji: 'ᛒ', title: 'Norse Rune', desc: 'Elder Futhark doğum runun' },
  { emoji: '🃏', title: 'Tarot Doğum Kartı', desc: 'Kişilik + Ruh, Major Arcana' },
  { emoji: '✦', title: 'Yıldız Irkı', desc: '10 galaktik arketipten dominant' },
];

export default function Welcome() {
  return (
    <div className="relative">
      <CosmicBackground variant="galaxy" />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16 md:pt-24">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold">
            SOULPROFILE · DOĞUM VERİSİ KİMLİK ANALİZİ
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-ink md:text-7xl">
            Doğduğunda yıldızlar sana <span className="text-gold">ne söylüyordu?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Doğum tarih · saat · yerinden <strong className="text-ink">9 analitik sistem</strong> aynı
            anda hesaplanır. Astronomik haritan, Human Design beden grafiğin, numerolojin, Vedik
            nakshatran, Maya Kin'in, Çin yıldız çarkın, Norse runun, Tarot doğum kartların ve yıldız
            ırkı arketipin — hepsi tek bir <strong className="text-ink">kozmik kimlik karnesinde</strong>.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/birth"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-10 py-5 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105"
            >
              <span className="text-xl">✦</span>
              Karnemi Şimdi Aç
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/compatibility"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gold/40 bg-bg/40 px-7 py-5 text-sm font-bold text-ink backdrop-blur transition-colors hover:border-gold hover:bg-gold/[0.05]"
            >
              <span>👥</span> İki Kişiyi Karşılaştır
            </Link>
          </div>

          <p className="mt-4 text-xs text-faint">
            ✦ Lansman dönemi · tamamen ücretsiz · 5 dakika sürer
          </p>
        </div>
      </section>

      {/* NASIL ÇALIŞIR — 3 ADIM */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">NASIL ÇALIŞIR</p>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">3 adımda kozmik kimliğin</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-panelBorder bg-panel/60 p-7 backdrop-blur transition-all hover:border-gold/40"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="font-display text-3xl text-gold/40">{s.n}</span>
                <span className="text-3xl">{s.icon}</span>
              </div>
              <h3 className="font-display text-2xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* İKİ ANA YOL — büyük kartlar */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">İKİ YOL</p>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
            Kendini tanı, sonra başkasıyla karşılaştır
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Kendi karnen */}
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#15043a] via-[#1a0a40] to-[#2a0a5a] p-7 transition-transform hover:-translate-y-1">
            <div className="starfield opacity-30" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-4xl">
                ✦
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
                1. KENDİ KARNEN
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">Kozmik kimliğini keşfet</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Doğum verinden 9 sistemin sentezi. 3D solar sistem, karakter stat kartı, AI üretimli
                "Ruhun Hikâyesi · Bilgelikleri · Gölgeleri" anlatımı.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink">
                <li className="flex gap-2"><span className="text-gold">🌍</span><span>3D döndürülebilir doğum gökyüzü</span></li>
                <li className="flex gap-2"><span className="text-gold">🌳</span><span>Yıldız Yaşam Ağacı animasyonu</span></li>
                <li className="flex gap-2"><span className="text-gold">🎴</span><span>10 stat'lı karakter kartı</span></li>
                <li className="flex gap-2"><span className="text-gold">📸</span><span>Paylaşılabilir karne görseli</span></li>
              </ul>
              <Link
                href="/birth"
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.02]"
              >
                Karnemi Aç
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* İkili uyum */}
          <div className="relative overflow-hidden rounded-3xl border border-cosmic/50 bg-gradient-to-br from-[#0b0524] via-[#1e1a6e] to-[#9d3cb1]/30 p-7 transition-transform hover:-translate-y-1">
            <div className="starfield opacity-30" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cosmic/20 text-4xl">
                ⚯
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-cosmic">
                2. İKİLİ UYUM
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">İki ruh nasıl anlaşır?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Senin karnen ile başka birinin doğum verisini karşılaştırırız. Astroloji synastry +
                Human Design tanımlı–tanımsız merkez dansı + numeroloji uyumu.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink">
                <li className="flex gap-2"><span className="text-cosmic">⚡</span><span>Elektromanyetik çekim kanalları</span></li>
                <li className="flex gap-2"><span className="text-cosmic">◐</span><span>Defined/Open merkez karşılaştırması</span></li>
                <li className="flex gap-2"><span className="text-cosmic">💞</span><span>Synastry açıları (Güneş-Ay, Venüs-Mars)</span></li>
                <li className="flex gap-2"><span className="text-cosmic">📊</span><span>4 boyutlu uyum skoru + AI yorum</span></li>
              </ul>
              <Link
                href="/compatibility"
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cosmic py-4 text-sm font-bold tracking-wide text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                Uyumu Hesapla
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9 SİSTEM */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">9 SİSTEM</p>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
            Tek karnede 9 farklı bilgelik
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {SYSTEMS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-panelBorder bg-panel/40 p-4 backdrop-blur transition-colors hover:border-gold/40"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                  <p className="mt-0.5 text-xs leading-snug text-muted">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW + FINAL CTA */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_0.85fr]">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-[28px] border border-panelBorder bg-[#0a0524] p-6 card-glow">
            <div className="absolute inset-0 bg-galaxy opacity-90" />
            <div className="starfield" />
            <div className="relative flex h-full flex-col items-center text-center">
              <span className="text-xs font-bold tracking-[0.4em] text-gold">PREVIEW</span>
              <span className="mt-2 text-4xl">✦</span>
              <h2 className="mt-3 font-display text-2xl leading-tight text-ink">Ada Yıldız</h2>
              <p className="mt-2 text-sm text-gold">Pleiadyalı · Kalp Şifacısı</p>
              <div className="mt-3 grid w-full grid-cols-3 gap-2 text-[10px] text-muted">
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♋</div>Yengeç Güneş</div>
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♓</div>Balık Ay</div>
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♍</div>Başak Yükselen</div>
              </div>
              <div className="mt-3 w-full rounded-xl border border-white/10 p-3 text-left">
                <p className="text-[9px] uppercase tracking-widest text-gold">Human Design</p>
                <p className="mt-1 font-display text-lg text-ink">Generator</p>
                <p className="text-[10px] text-muted">Sakral Otorite · 3/5 Profil</p>
              </div>
              <p className="mt-auto text-[9px] tracking-widest text-faint">soulprofile.life</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">ŞİMDİ BAŞLA</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Yıldızların sana söylediğini duy.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              5 dakikada doğum verini gir, 9 sistemin sentezinden çıkan kozmik kimliğini al.
              Lansman dönemi boyunca tüm özellikler ücretsiz açık.
            </p>
            <Link
              href="/birth"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-gold px-9 py-5 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105"
            >
              <span className="text-xl">✦</span>
              Galaktik Karnemi Aç
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <p className="mt-4 text-xs text-faint">
              Doğum tarihi/saati/yeri ile başla · Profil fotoğrafı opsiyonel · Veriler sende kalır
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
