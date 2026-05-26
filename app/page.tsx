import Link from 'next/link';
import { CosmicBackground } from '@/components/CosmicBackground';

const FEATURES = [
  { emoji: '✨', title: 'Yıldız Kökeni', desc: 'Pleiades, Sirius, Arcturus, Andromeda... Hangi yıldız hattındansın?' },
  { emoji: '🌙', title: 'Astrolojik Harita', desc: 'Güneş, Ay, Yükselen + Kuzey/Güney Ay Düğümü görevin.' },
  { emoji: '◇', title: 'Human Design', desc: 'Tip, otorite, strateji ve profilinle karar pusulan.' },
  { emoji: '⌖', title: 'Numeroloji', desc: 'Yaşam Yolu (master numbers dahil), İfade, Ruh Arzusu, Kişisel Yıl.' },
  { emoji: '☼', title: '3 Görev', desc: 'Bu yaşamda hatırlaman gereken kozmik görev çağrısı.' },
  { emoji: '📸', title: 'Paylaşılabilir', desc: 'Karnen fotoğrafına basılır, Instagram story formatında paylaşılır.' },
];

export default function Welcome() {
  return (
    <div className="relative">
      <CosmicBackground variant="galaxy" />

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 md:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold">SOULPROFILE</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
              Doğduğunda <br />
              yıldızlar sana <br />
              <span className="text-gold">ne söylüyordu?</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Batı astrolojisi, Vedik harita, Çin yıldız çarkı, Maya Tzolkin, Kelt ağacı, Human
              Design, numeroloji ve yıldız ırkı bilgeliklerinin sentezinden çıkan tek bir kozmik
              kimliğin. Sen sadece insan değilsin.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/birth"
                className="rounded-full bg-gold px-7 py-4 text-sm font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105"
              >
                Karnemi Hazırla
              </Link>
              <Link
                href="/glossary"
                className="rounded-full border border-panelBorder px-7 py-4 text-sm text-ink transition-colors hover:border-gold hover:text-gold"
              >
                Kavramları Keşfet
              </Link>
            </div>
            <p className="mt-4 text-xs text-faint">
              İlk karne ücretsiz · Premium yakında · 16 yaş ve üzeri
            </p>
          </div>

          <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[28px] border border-panelBorder bg-[#0a0524] p-6 card-glow">
            <div className="absolute inset-0 bg-galaxy opacity-90" />
            <div className="starfield" />
            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <span className="text-xs font-bold tracking-[0.4em] text-gold">PREVIEW</span>
              <span className="mt-2 text-4xl">✦</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-ink">
                Ada Yıldız
              </h2>
              <p className="mt-2 text-sm text-gold">Pleiadyalı · Kalp Şifacısı</p>
              <p className="mt-1 text-xs text-muted">Ülker Sistemi</p>
              <div className="mt-6 grid w-full grid-cols-3 gap-2 text-[10px] text-muted">
                <div className="rounded-lg border border-white/10 p-2">
                  <div className="text-gold">♋</div>Yengeç Güneş
                </div>
                <div className="rounded-lg border border-white/10 p-2">
                  <div className="text-gold">♓</div>Balık Ay
                </div>
                <div className="rounded-lg border border-white/10 p-2">
                  <div className="text-gold">♍</div>Başak Yükselen
                </div>
              </div>
              <div className="mt-4 w-full rounded-xl border border-white/10 p-3 text-left">
                <p className="text-[9px] uppercase tracking-widest text-gold">Human Design</p>
                <p className="mt-1 font-display text-xl text-ink">Generator</p>
                <p className="text-[10px] text-muted">Sakral Otorite · 3/5 Profil</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-panelBorder bg-panel p-5 backdrop-blur"
            >
              <div className="text-2xl text-gold">{f.emoji}</div>
              <h3 className="mt-3 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
