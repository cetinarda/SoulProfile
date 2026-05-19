import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function Privacy() {
  return (
    <PageLayout
      kicker="GİZLİLİK POLİTİKASI"
      title="Senin verin sana ait"
      intro="Bu politika SoulProfile'ın doğum bilgilerini, fotoğrafını ve uygulama içi etkileşimlerini nasıl topladığını, sakladığını ve sildiğini açıklar. Son güncelleme: 19 Mayıs 2026."
    >
      <Section heading="Topladığımız Veriler">
        <P>Karneni üretebilmek için aşağıdaki verileri topluyoruz:</P>
        <Bullet>Tam adın (karne başlığı için)</Bullet>
        <Bullet>Doğum tarihi, doğum saati ve doğum yeri (gezegen pozisyonları + Human Design için zorunlu)</Bullet>
        <Bullet>İsteğe bağlı profil fotoğrafı (karne görseline basılır; sadece sen ve seçtiğin paylaşım kanalları görür)</Bullet>
        <Bullet>Uygulama kullanım analitikleri (anonimleştirilmiş)</Bullet>
      </Section>

      <Section heading="Verini Neden Topluyoruz">
        <P>
          Astrolojik harita, Kuzey/Güney Ay Düğümü, Human Design tipi ve numerolojin için bu veriler
          zorunlu. Hesaplamalar çoğunlukla cihazında yapılır. Karne kaydedilirken Supabase üzerinde
          şifreli olarak senin hesabına bağlı tutulur.
        </P>
      </Section>

      <Section heading="Üçüncü Taraflar">
        <Bullet>
          <Bullet>Anthropic Claude API:</Bullet> Anlatım metni üretirken karne özetin gönderilir.
          Anthropic varsayılan olarak verini eğitim için kullanmaz.
        </Bullet>
        <Bullet>
          <Bullet>Supabase:</Bullet> Hesap, doğum bilgisi ve karne kayıtları için. EU bölgesinde
          barındırılır.
        </Bullet>
        <Bullet>
          <Bullet>RevenueCat & Apple/Stripe:</Bullet> Abonelik yönetimi (sadece ödeme yaparsan).
        </Bullet>
        <Bullet>
          <Bullet>Open-Meteo Geocoding:</Bullet> Doğum yeri adından koordinat ve saat dilimi
          almak için.
        </Bullet>
      </Section>

      <Section heading="Saklama Süresi">
        <P>
          Hesabın aktif kaldığı sürece verin saklanır. Hesabını sildiğinde tüm doğum bilgilerin
          ve karnelerin 30 gün içinde kalıcı olarak silinir. Yedeklerden tamamen kaldırılma 90 günü
          bulabilir.
        </P>
      </Section>

      <Section heading="Haklarınız (KVKK + GDPR)">
        <Bullet>İşlenen verilere erişim ve kopya talep etme</Bullet>
        <Bullet>Düzeltme talep etme</Bullet>
        <Bullet>Silinmesini talep etme ("unutulma hakkı")</Bullet>
        <Bullet>İşlemenin kısıtlanmasını talep etme</Bullet>
        <Bullet>Veri taşınabilirliği (JSON export)</Bullet>
        <Bullet>İtirazda bulunma</Bullet>
        <P>Talepler için: privacy@soulprofile.life</P>
      </Section>

      <Section heading="Çocukların Verileri">
        <P>
          SoulProfile 16 yaş altı kullanıcılar için tasarlanmamıştır. 16 yaş altı bir kullanıcının
          veri sağladığını fark edersek, derhal silinir.
        </P>
      </Section>

      <Section heading="Değişiklikler">
        <P>
          Bu politikada yapılan önemli değişiklikleri uygulama içinde ve e-posta yoluyla en az 7
          gün önceden duyururuz.
        </P>
      </Section>
    </PageLayout>
  );
}
