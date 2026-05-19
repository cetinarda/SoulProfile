import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function Cookie() {
  return (
    <PageLayout
      kicker="ÇEREZ POLİTİKASI"
      title="Hangi çerezleri kullanıyoruz"
      intro="Web sürümünde sınırlı sayıda çerez kullanırız. Mobil uygulamada çerez kullanılmaz."
    >
      <Section heading="Zorunlu Çerezler">
        <Bullet>Oturum (auth) tokenleri: Giriş yapmış kullanıcının kimliğini korumak için.</Bullet>
        <Bullet>Tercihler (dil, tema): Cihazına özel ayarları hatırlamak için.</Bullet>
      </Section>

      <Section heading="Analitik Çerezler (opsiyonel)">
        <P>
          Anonim kullanım istatistikleri için (sayfa görüntüleme, tıklama akışı). İlk ziyarette
          rızanı sorarız; reddedersen yüklemeyiz.
        </P>
      </Section>

      <Section heading="Üçüncü Taraf Çerezler">
        <Bullet>Stripe Checkout (yalnız ödeme akışında)</Bullet>
        <Bullet>Cloudflare Turnstile (bot koruması, kayıt sırasında)</Bullet>
      </Section>

      <Section heading="Yönetim">
        <P>
          Tarayıcı ayarlarından tüm çerezleri silebilir veya engelleyebilirsin. Bu durumda uygulamanın
          bazı özellikleri çalışmayabilir.
        </P>
      </Section>
    </PageLayout>
  );
}
