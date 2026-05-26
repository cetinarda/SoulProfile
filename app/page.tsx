import Link from 'next/link';
import { CosmicBackground } from '@/components/CosmicBackground';

const FEATURES = [
  { emoji: '✦', title: 'Yıldız Kökenin', desc: 'Pleiadyalı, Siryan, Arkturian, Andromedan, Lyran... Hangi yıldız hattındansın?' },
  { emoji: '🌙', title: 'Astrolojik Harita', desc: 'Güneş, Ay, Yükselen + Kuzey/Güney Ay Düğümü görevin.' },
  { emoji: '◇', title: 'Human Design', desc: 'Tip, otorite, strateji ve profilinle karar pusulan.' },
  { emoji: '⌖', title: 'Numeroloji', desc: 'Yaşam Yolu (master 11/22/33), İfade, Ruh Arzusu, Kişisel Yıl.' },
  { emoji: '🦋', title: 'Maya Tzolkin', desc: 'Kin numaran, 20 gün mührü × 13 ton kombinasyonu.' },
  { emoji: '🪷', title: 'Vedik Nakshatra', desc: 'Ay\'ın 27 yıldız evinden hangisinde — derin sezgi mührün.' },
  { emoji: '🐉', title: 'Çin Zodyak', desc: 'Hayvanın, elementin, yin-yang polariten.' },
  { emoji: 'ᛒ', title: 'Norse Rune', desc: 'Doğum runun — kuzey bilgeliğinden gelen mühür.' },
  { emoji: '🃏', title: 'Tarot Doğum Kartı', desc: 'Kişilik + Ruh kartların — bu yaşamın arketipi.' },
];

const HIGHLIGHTS = [
  { icon: '🌍', text: '3D döndürülebilir doğum gökyüzü — gerçek gezegen dokuları' },
  { icon: '🌳', text: 'Yıldız Yaşam Ağacı: doğumdan bugüne gezegen yolların' },
  { icon: '🎴', text: 'Karakter Stat kartı: Güç · Sezgi · Dayanıklılık · Bilgelik...' },
  { icon: '📜', text: 'AI üretimli Ruhun Hikâyesi · Bilgelikleri · Gölgeleri' },
  { icon: '📸', text: 'Paylaşılabilir karne görseli (fotoğrafınla birlikte)' },
];

export default function Welcome() {
  return (
    <div className="relative">
      <CosmicBackground variant="galaxy" />

      <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 md:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold">SOULPROFILE</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
              Doğduğunda <br />
              yıldızlar sana <br />
              <span className="text-gold">ne söylüyordu?</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              9 farklı sistemin sentezinden çıkan tek bir kozmik kimliğin. Batı astrolojisi,
              Vedik nakshatra, Çin zodyak, Maya Tzolkin, Norse rune, Tarot, Human Design,
              numeroloji ve yıldız ırkı — hepsi bir karnede.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/birth"
                className="rounded-full bg-gold px-7 py-4 text-sm font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105"
              >
                Karnemi Hazırla →
              </Link>
              <Link
                href="/glossary"
                className="rounded-full border border-panelBorder px-7 py-4 text-sm text-ink transition-colors hover:border-gold hover:text-gold"
              >
                Kavramları Keşfet
              </Link>
            </div>
            <p className="mt-4 text-xs text-faint">
              ✦ Lansman dönemi: tüm premium ücretsiz · 16 yaş ve üzeri · Verin sende kalır
            </p>
          </div>

          <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[28px] border border-panelBorder bg-[#0a0524] p-6 card-glow">
            <div className="absolute inset-0 bg-galaxy opacity-90" />
            <div className="starfield" />
            <div className="relative flex h-full flex-col items-center text-center">
              <span className="text-xs font-bold tracking-[0.4em] text-gold">PREVIEW</span>
              <span className="mt-2 text-4xl">✦</span>
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink">Ada Yıldız</h2>
              <p className="mt-2 text-sm text-gold">Pleiadyalı · Kalp Şifacısı</p>
              <p className="mt-1 text-xs text-muted">Ülker · 28.04.1994 · 14:30 İstanbul</p>
              <div className="mt-4 grid w-full grid-cols-3 gap-2 text-[10px] text-muted">
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♋</div>Yengeç Güneş</div>
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♓</div>Balık Ay</div>
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">♍</div>Başak Yükselen</div>
              </div>
              <div className="mt-3 w-full rounded-xl border border-white/10 p-3 text-left">
                <p className="text-[9px] uppercase tracking-widest text-gold">Human Design</p>
                <p className="mt-1 font-display text-xl text-ink">Generator</p>
                <p className="text-[10px] text-muted">Sakral Otorite · 3/5 Profil</p>
              </div>
              <div className="mt-2 grid w-full grid-cols-2 gap-2 text-[10px] text-muted">
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">🦋 Kin 122</div>Beyaz Kristal Rüzgâr</div>
                <div className="rounded-lg border border-white/10 p-2"><div className="text-gold">🪷 Pushya</div>Beslenen Koruyucu</div>
              </div>
              <p className="mt-auto text-[9px] tracking-widest text-faint">soulprofile.life</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vurgu satırları */}
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.text}
              className="rounded-2xl border border-gold/30 bg-gold/[0.04] p-4 text-center text-[13px] text-ink"
            >
              <div className="mb-1 text-2xl">{h.icon}</div>
              {h.text}
            </div>
          ))}
        </div>
      </section>

      {/* 9 sistem */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-6 text-center font-display text-3xl text-ink">
          9 sistem · 1 kimlik
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-panelBorder bg-panel p-5 backdrop-blur transition-all hover:border-gold/40"
            >
              <div className="text-2xl">{f.emoji}</div>
              <h3 className="mt-3 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-gold/40 bg-gold/[0.06] p-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">ŞİMDİ BAŞLA</p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            Yıldızların sana söylediğini duy.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            5 dakikada doğum verini gir, 20 sistemden geçen sentezini al.
            Lansman dönemi boyunca her şey ücretsiz.
          </p>
          <Link
            href="/birth"
            className="mt-6 inline-block rounded-full bg-gold px-8 py-4 text-sm font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105"
          >
            Galaktik Karnemi Aç →
          </Link>
        </div>
      </section>
    </div>
  );
}
