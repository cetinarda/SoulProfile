import { CosmicBackground } from './CosmicBackground';

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  variant?: 'galaxy' | 'cosmic' | 'aurora';
};

export function PageLayout({ kicker, title, intro, children, variant = 'cosmic' }: Props) {
  return (
    <div className="relative min-h-[80vh] py-14 md:py-20">
      <CosmicBackground variant={variant} />
      <div className="mx-auto max-w-3xl px-6">
        {kicker ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-gold">{kicker}</p>
        ) : null}
        <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{intro}</p>
        ) : null}
        <div className="mt-10 space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-panelBorder bg-panel p-6">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">{heading}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 text-xs text-gold">✦</span>
      <p className="flex-1 text-[14px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}
