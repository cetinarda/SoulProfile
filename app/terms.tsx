import { PageLayout, Section, P, Bullet } from '../components/PageLayout';

export default function Terms() {
  return (
    <PageLayout
      kicker="KULLANIM KOŞULLARI"
      title="Aramızdaki anlaşma"
      intro="SoulProfile'ı kullanarak aşağıdaki koşulları kabul etmiş sayılırsın. Son güncelleme: 19 Mayıs 2026."
    >
      <Section heading="Hizmetin Niteliği">
        <P>
          SoulProfile; astroloji, Human Design ve numeroloji içeriklerini farkındalık ve kendini
          keşif amacıyla sunan bir uygulamadır. <P>Tıbbi, psikiyatrik, hukuki veya finansal tavsiye
          değildir.</P>
        </P>
        <P>
          Karnedeki yorumlar sembolik dildedir; karar verme süreçlerinde profesyonel destek almayı
          ihmal etme.
        </P>
      </Section>

      <Section heading="Hesap ve Yaş Koşulu">
        <Bullet>16 yaşın altındaysan SoulProfile'ı kullanma.</Bullet>
        <Bullet>Doğum bilgilerini doğru girmek senin sorumluluğun. Yanlış veri yanlış karneye yol açar.</Bullet>
        <Bullet>Hesabını korumak (şifre/cihaz erişimi) sana aittir.</Bullet>
      </Section>

      <Section heading="Abonelikler">
        <P>
          Premium abonelikler haftalık, aylık veya yıllık olarak Apple App Store veya Stripe
          üzerinden faturalanır. Otomatik yenilenir; iptal etmek için ilgili mağaza/portal
          ayarlarını kullan. Periyot bittikten sonra erişim sonlanır; geri ödeme platform politikalarına
          tabidir.
        </P>
      </Section>

      <Section heading="Fikri Mülkiyet">
        <P>
          Uygulama içeriği, karne tasarımı, yıldız ırkı arketipleri ve metin şablonları SoulProfile'a
          aittir. Kendi karneni paylaşma hakkın saklıdır; karne görselleri kişisel kullanım için
          ücretsiz indirilebilir.
        </P>
      </Section>

      <Section heading="Yasaklı Kullanım">
        <Bullet>Başkalarının verilerini izinsiz girmek</Bullet>
        <Bullet>Otomatik araçlarla scraping yapmak</Bullet>
        <Bullet>API'yi tersine mühendislikle çoğaltmak</Bullet>
        <Bullet>İçeriği başka bir hizmette yeniden yayımlamak</Bullet>
      </Section>

      <Section heading="Sorumluluk Sınırı">
        <P>
          SoulProfile içerikleri "olduğu gibi" sunulur. Yorumların doğruluğu, eksiksizliği veya
          herhangi bir sonuca uygunluğu garanti edilmez. Yasanın izin verdiği azami ölçüde, kullanımdan
          kaynaklanan dolaylı zararlardan sorumlu değiliz.
        </P>
      </Section>

      <Section heading="Sonlandırma">
        <P>
          Bu koşulları ihlal eden hesaplar uyarısız sonlandırılabilir. İstediğin zaman hesabını
          silebilirsin (Profil → Veri Talepleri).
        </P>
      </Section>

      <Section heading="Uygulanacak Hukuk">
        <P>
          Bu sözleşmeye Türkiye Cumhuriyeti yasaları uygulanır. Anlaşmazlıklarda İstanbul Anadolu
          mahkemeleri ve icra daireleri yetkilidir. AB kullanıcıları için tüketici mevzuatından
          doğan haklar saklıdır.
        </P>
      </Section>
    </PageLayout>
  );
}
