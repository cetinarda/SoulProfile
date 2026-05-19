import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function Support() {
  return (
    <PageLayout
      kicker="DESTEK"
      title="Buradayız"
      intro="Sıkça sorulan sorular ve bize ulaşman için bilgiler."
    >
      <Section heading="Sıkça Sorulanlar">
        <Bullet>
          <Bullet>Doğum saatimi bilmiyorum, sorun olur mu?</Bullet> Hayır. Yükselen Burç ve Human
          Design otoritesi tam doğru olmayabilir; karnenin geri kalanı çalışır. Form'da "Saat
          biliniyor" anahtarını kapat.
        </Bullet>
        <Bullet>
          <Bullet>Verim güvende mi?</Bullet> Evet. Doğum verin EU bölgesinde şifreli saklanır,
          istediğin zaman silinir. Detay: Gizlilik Politikası.
        </Bullet>
        <Bullet>
          <Bullet>Aboneliğimi nasıl iptal ederim?</Bullet> iOS: Ayarlar → Apple ID → Abonelikler.
          Web: Profil → Abonelik → İptal.
        </Bullet>
        <Bullet>
          <Bullet>Karnem yanlış mı çıktı?</Bullet> Doğum tarihi/saati/yeri girişini kontrol et.
          Yer otokompletinden seçtiğin koordinat ve saat dilimi kritik.
        </Bullet>
        <Bullet>
          <Bullet>İade alabilir miyim?</Bullet> Apple/Play satın alımlarında kendi mağaza
          politikaları geçerli. Web ödemelerinde 14 gün cayma hakkın var.
        </Bullet>
      </Section>

      <Section heading="Bize Ulaş">
        <P>Yanıt süremiz iş günleri içinde 24 saatten azdır.</P>
        <Bullet>Genel: hello@soulprofile.life</Bullet>
        <Bullet>Gizlilik / Veri Talepleri: privacy@soulprofile.life</Bullet>
        <Bullet>Yasal / İş Birliği: legal@soulprofile.life</Bullet>
        <Bullet>Basın: press@soulprofile.life</Bullet>
      </Section>
    </PageLayout>
  );
}
