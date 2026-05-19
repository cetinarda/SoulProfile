import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function Contact() {
  return (
    <PageLayout
      kicker="İLETİŞİM"
      title="Yıldız çocuk, seni dinliyoruz"
    >
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
        <P>SoulProfile · Galaktik Yazılım Yayıncılık A.Ş.</P>
        <P>İstanbul, Türkiye</P>
      </Section>
    </PageLayout>
  );
}
