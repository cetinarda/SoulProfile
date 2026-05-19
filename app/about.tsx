import { PageLayout, Section, P } from '../components/PageLayout';

export default function About() {
  return (
    <PageLayout
      kicker="HAKKIMIZDA"
      title="Sen sadece insan değilsin"
      intro="SoulProfile, doğum verilerinden gelen bir kozmik aynadır. Astroloji, Human Design, numeroloji ve yıldız ırkı bilgeliklerini tek bir karne'de birleştiriyoruz."
    >
      <Section heading="Niye Var?">
        <P>
          Çünkü kimliğin yalnızca bir burç değil. Hem Güneş'in, hem Ay'ın, hem Kuzey ve Güney
          Düğümün, hem Human Design tipin, hem Yaşam Yolu sayın ve hem de yıldız hattının
          birbiriyle konuşan bir bütünsün. Bunu görmek, kendini hatırlamanın hızlandırıcısıdır.
        </P>
      </Section>

      <Section heading="Vaatlerimiz">
        <P>
          Verilerin sende kalır. Uydurma falcılık yapmayız; metinler astronomik ve sembolik olarak
          tutarlıdır. Bir uygulamanın tıbbi/psikolojik yerine geçemeyeceğini bilirsin — biz de
          öyle davranırız.
        </P>
      </Section>

      <Section heading="Yapım">
        <P>
          Saf JavaScript astronomi motoru (gezegen pozisyonları), tüm 64 Human Design kapısı +
          kanal + merkez hesabı, Pythagorean numeroloji (master sayıları korur), Claude API ile
          yumuşak ve şefkatli bir Türkçe anlatım üretimi.
        </P>
      </Section>
    </PageLayout>
  );
}
