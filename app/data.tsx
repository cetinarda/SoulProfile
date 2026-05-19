import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function DataRights() {
  return (
    <PageLayout
      kicker="VERİ HAKLARIN"
      title="Verin sana ait — KVKK & GDPR"
      intro="Her kullanıcı kendi verisinin sahibidir. SoulProfile, KVKK (6698 sayılı Kanun) ve GDPR çerçevesinde aşağıdaki hakları teminat altına alır."
    >
      <Section heading="Haklarınız">
        <Bullet>Hangi verilerinin işlendiğini öğrenme</Bullet>
        <Bullet>İşlenme amacını ve verilerin nereye aktarıldığını öğrenme</Bullet>
        <Bullet>Eksik veya yanlış işlenmişse düzeltilmesini isteme</Bullet>
        <Bullet>Silinmesini veya yok edilmesini isteme</Bullet>
        <Bullet>İşlemenin durdurulmasını veya kısıtlanmasını isteme</Bullet>
        <Bullet>Otomatik karar verme süreçlerine itiraz etme</Bullet>
        <Bullet>Verilerin başka bir hizmete taşınmasını talep etme (JSON portability)</Bullet>
      </Section>

      <Section heading="Nasıl Talep Açılır">
        <P>
          Uygulama içinden: Profil → Gizlilik → "Verilerimi indir" veya "Hesabımı sil".
        </P>
        <P>
          E-posta ile: privacy@soulprofile.life adresine kayıtlı e-postandan talebini yazarsın.
          Kimliğini doğrulamak için ek bilgi isteyebiliriz.
        </P>
      </Section>

      <Section heading="Yanıt Süresi">
        <P>
          KVKK kapsamında en geç 30 gün, GDPR kapsamında en geç 1 ay içinde sana yanıt veririz.
          Karmaşık talepler 2 aya kadar uzayabilir; bu durumda gerekçeyi bildiririz.
        </P>
      </Section>

      <Section heading="Şikâyet Hakkın">
        <P>
          Türkiye'de Kişisel Verileri Koruma Kurumu'na (KVKK), AB'de ilgili ulusal veri koruma
          otoritesine şikâyette bulunma hakkın saklıdır.
        </P>
      </Section>
    </PageLayout>
  );
}
