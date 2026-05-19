import { PageLayout, Section, Bullet } from '@/components/PageLayout';

export const metadata = { title: 'İletişim — SoulProfile' };

export default function Contact() {
  return (
    <PageLayout kicker="İLETİŞİM" title="Yıldız çocuk, seni dinliyoruz">
      <Section heading="E-Posta">
        <Bullet>Genel: hello@soulprofile.life</Bullet>
        <Bullet>Destek: support@soulprofile.life</Bullet>
        <Bullet>Gizlilik: privacy@soulprofile.life</Bullet>
        <Bullet>İş Birliği: partners@soulprofile.life</Bullet>
      </Section>

      <Section heading="Sosyal Medya">
        <Bullet>Instagram: @soulprofile</Bullet>
        <Bullet>TikTok: @soulprofile</Bullet>
        <Bullet>X / Twitter: @soulprofileapp</Bullet>
      </Section>

      <Section heading="Adres">
        <p>SoulProfile · Galaktik Yazılım Yayıncılık A.Ş.</p>
        <p>İstanbul, Türkiye</p>
      </Section>
    </PageLayout>
  );
}
