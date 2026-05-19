export type GlossaryEntry = {
  id: string;
  category: 'numerology' | 'astrology' | 'chakra' | 'biorhythm' | 'reiki' | 'practice';
  term: string;
  description: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'life-path',
    category: 'numerology',
    term: 'Yaşam Yolu Sayısı (Life Path Number)',
    description:
      'Doğum tarihindeki tüm rakamların tek haneli bir sayıya (veya 11, 22, 33 usta sayılarına) indirgenmesiyle bulunan kişisel sayıdır. Hayat amacını, doğal yeteneklerini ve yaşam yolculuğunun temel enerjisini temsil eder.',
  },
  {
    id: 'personal-year',
    category: 'numerology',
    term: 'Kişisel Yıl Sayısı',
    description:
      'Doğum gününüz ve ayınız ile içinde bulunduğunuz yılın rakamlarının toplanmasıyla hesaplanır. 1-9 arasında döngüsel bir enerji haritası sunar. Her yıl farklı bir tema ve enerji getirir.',
  },
  {
    id: 'reduce',
    category: 'numerology',
    term: 'İndirgeme (Reduce)',
    description:
      'Numerolojide çok haneli sayıları tek haneye düşürme işlemidir. Tüm rakamlar toplanır, sonuç 9\'dan büyükse tekrar toplanır. 11, 22 ve 33 "Usta Sayılar" olarak indirgenmez, özel anlamları korunur.',
  },
  {
    id: 'sun-sign',
    category: 'astrology',
    term: 'Burç (Güneş Burcu)',
    description:
      'Doğduğunuz tarihte Güneş\'in bulunduğu burçtur. Temel kişiliğinizi, egonuzu ve yaşam enerjinizi temsil eder.',
  },
  {
    id: 'ascendant',
    category: 'astrology',
    term: 'Yükselen Burç (Ascendant)',
    description:
      'Doğum anında ufuk çizgisinde yükselen burçtur. Dış dünyanın sizi nasıl gördüğünü, fiziksel görünümünüzü ve ilk izleniminizi belirler. Hesaplamak için doğum saati gereklidir.',
  },
  {
    id: 'twelfth-house',
    category: 'astrology',
    term: '12. Ev & Yönetici Gezegen',
    description:
      'Astrolojide 12. ev bilinçaltını, gizli güçleri, spiritüel potansiyeli ve içsel dünyayı temsil eder. Her evin bir yönetici gezegeni vardır ve bu gezegen o evin temalarını nasıl deneyimlediğinizi belirler.',
  },
  {
    id: 'planet-powers',
    category: 'astrology',
    term: 'Gezegen Güçleri',
    description:
      'Her gezegen farklı bir yaşam alanını ve enerjiyi yönetir: Güneş (benlik), Ay (duygular), Merkür (iletişim), Venüs (sevgi), Mars (aksiyon), Jüpiter (genişleme), Satürn (disiplin), Uranüs (özgünlük), Neptün (hayal gücü), Pluto (dönüşüm).',
  },
  {
    id: 'north-node',
    category: 'astrology',
    term: 'Kuzey Ay Düğümü (Rahu)',
    description:
      'Bu hayattaki ruhsal görev, gelişim yönü ve büyüme istikametidir. Konfor alanının ötesinde, ruhun ulaşmayı seçtiği zirvenin pusulasıdır.',
  },
  {
    id: 'south-node',
    category: 'astrology',
    term: 'Güney Ay Düğümü (Ketu)',
    description:
      'Geçmiş yaşamlardan getirilen alışkanlıklar ve içgüdüsel beceriler. Aşırı kullanıldığında bizi geriye çeken konfor alanıdır.',
  },
  {
    id: 'chakra-system',
    category: 'chakra',
    term: 'Çakra Nedir?',
    description:
      'Sanskrit dilinde "tekerlek" anlamına gelir. Vücuttaki enerji merkezleridir. 7 ana çakra omurga boyunca sıralanır. Her biri farklı fiziksel, duygusal ve spiritüel alanları yönetir.',
  },
  {
    id: 'chakra-22',
    category: 'chakra',
    term: '22 Çakra Sistemi',
    description:
      '7 ana çakranın ötesinde 15 ek enerji merkezi daha bulunur. Bunlar arasında Yeryüzü Yıldızı, Ruh, Thymus, Orion, Soul Star gibi daha ileri düzey enerji merkezleri yer alır.',
  },
  {
    id: 'biorhythm-intro',
    category: 'biorhythm',
    term: 'Biyoritm Nedir?',
    description:
      'Doğum tarihinden itibaren başlayan üç döngüsel biyolojik ritimdir. Her döngü sinüs dalgası şeklinde pozitif ve negatif arasında salınır. Değerler -100 ile +100 arasında değişir.',
  },
  {
    id: 'biorhythm-physical',
    category: 'biorhythm',
    term: 'Fiziksel Biyoritm (23 gün)',
    description:
      'Fiziksel enerji, güç, dayanıklılık ve koordinasyonu yansıtır. Pozitif dönemde enerjin yüksek, negatif dönemde dinlenme ihtiyacın artar.',
  },
  {
    id: 'biorhythm-emotional',
    category: 'biorhythm',
    term: 'Duygusal Biyoritm (28 gün)',
    description:
      'Duygusal denge, ruh hali, yaratıcılık ve sezgiyi yansıtır. Pozitif dönemde iyimser ve empatiğin, negatif dönemde hassas ve içe dönüksün.',
  },
  {
    id: 'biorhythm-mental',
    category: 'biorhythm',
    term: 'Zihinsel Biyoritm (33 gün)',
    description:
      'Zihinsel keskinlik, konsantrasyon, hafıza ve analitik düşünme kapasitesini yansıtır.',
  },
  {
    id: 'reiki',
    category: 'reiki',
    term: 'Reiki Nedir?',
    description:
      'Japonca "evrensel yaşam enerjisi" anlamına gelen bir farkındalık pratiğidir. Ellerin enerji merkezlerine (çakralara) yerleştirilmesiyle kişisel farkındalık ve rahatlama deneyimi sunar. Tıbbi bir tedavi veya teşhis yöntemi değildir.',
  },
  {
    id: 'louise-hay',
    category: 'reiki',
    term: 'Louise Hay Yöntemi',
    description:
      'Fiziksel rahatsızlıkların altında yatan zihinsel ve duygusal nedenleri inceleyen bir yaklaşımdır. Örneğin baş ağrısı "kendini geçersiz sayma", sırt ağrısı "duygusal destek eksikliği" ile ilişkilendirilir.',
  },
  {
    id: 'morning-intention',
    category: 'practice',
    term: 'Sabah Niyeti',
    description:
      'Her güne bilinçli bir niyetle başlama pratiğidir. Kısa bir cümle veya kelime ile o günün odak noktasını belirlersiniz.',
  },
  {
    id: 'breath-4-1-5-3-5',
    category: 'practice',
    term: 'Nefes Egzersizi (4-1.5-3.5)',
    description:
      'Al (4 sn) → Tut (1.5 sn) → Ver (3.5 sn) → Dinlen ritmiyle yapılan nefes pratiğidir. Parasempatik sinir sistemini aktive ederek stresi azaltır ve odaklanmayı artırır.',
  },
];
