import { PageLayout, Section, Bullet } from '@/components/PageLayout';

export const metadata = { title: 'Çerez Politikası — SoulProfile' };

export default function Cookie() {
  return (
    <PageLayout
      kicker="ÇEREZ POLİTİKASI"
      title="Hangi çerezleri kullanıyoruz"
      intro="Web sürümünde sınırlı sayıda çerez kullanırız."
    >
      <Section heading="Zorunlu Çerezler">
        <Bullet>Oturum (auth) tokenleri: Giriş yapmış kullanıcının kimliğini korumak için.</Bullet>
        <Bullet>Tercihler (dil, tema): Cihazına özel ayarları hatırlamak için.</Bullet>
      </Section>

      <Section heading="Analitik Çerezler (opsiyonel)">
        <p>
          Anonim kullanım istatistikleri için. İlk ziyarette rızanı sorarız; reddedersen
          yüklemeyiz.
        </p>
      </Section>

      <Section heading="Üçüncü Taraf Çerezler">
        <Bullet>Stripe Checkout (yalnız ödeme akışında)</Bullet>
        <Bullet>Cloudflare Turnstile (bot koruması, kayıt sırasında)</Bullet>
      </Section>

      <Section heading="Yönetim">
        <p>
          Tarayıcı ayarlarından tüm çerezleri silebilir veya engelleyebilirsin. Bu durumda uygulamanın
          bazı özellikleri çalışmayabilir.
        </p>
      </Section>
    </PageLayout>
  );
}
