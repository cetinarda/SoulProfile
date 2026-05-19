export type ChakraInfo = {
  id: string;
  name: string;
  sanskrit: string;
  location: string;
  color: string;
  element: string;
  represents: string;
  balanced: string;
  imbalanced: string;
};

export const CHAKRAS: ChakraInfo[] = [
  {
    id: 'root',
    name: 'Kök Çakra',
    sanskrit: 'Muladhara',
    location: 'Omurga tabanı',
    color: '#d92c2c',
    element: 'Toprak',
    represents: 'Güvenlik, hayatta kalma, temel ihtiyaçlar, topraklanma.',
    balanced: 'Güvende hissedersin.',
    imbalanced: 'Korku, kaygı, maddi endişeler.',
  },
  {
    id: 'sacral',
    name: 'Sakral Çakra',
    sanskrit: 'Svadhisthana',
    location: 'Göbek altı',
    color: '#ff7e36',
    element: 'Su',
    represents: 'Yaratıcılık, duygular, cinsellik, zevk alma.',
    balanced: 'Akışta hissedersin.',
    imbalanced: 'Duygusal istikrarsızlık, yaratıcılık tıkanması.',
  },
  {
    id: 'solar',
    name: 'Güneş Pleksusu Çakra',
    sanskrit: 'Manipura',
    location: 'Mide bölgesi',
    color: '#ffd23f',
    element: 'Ateş',
    represents: 'Özgüven, irade gücü, kişisel güç.',
    balanced: 'Güçlü ve kararlı hissedersin.',
    imbalanced: 'Güçsüzlük, kontrol sorunları.',
  },
  {
    id: 'heart',
    name: 'Kalp Çakra',
    sanskrit: 'Anahata',
    location: 'Göğüs merkezi',
    color: '#3ed598',
    element: 'Hava',
    represents: 'Sevgi, şefkat, bağışlama, ilişkiler.',
    balanced: 'Sevgiyle açık hissedersin.',
    imbalanced: 'Kıskançlık, yalnızlık, bağlanma korkusu.',
  },
  {
    id: 'throat',
    name: 'Boğaz Çakra',
    sanskrit: 'Vishuddha',
    location: 'Boğaz',
    color: '#3ec1ff',
    element: 'Ses',
    represents: 'İletişim, kendini ifade, hakikat.',
    balanced: 'Rahatça konuşursun.',
    imbalanced: 'İfade zorluğu, yalan söyleme eğilimi.',
  },
  {
    id: 'third-eye',
    name: 'Üçüncü Göz Çakra',
    sanskrit: 'Ajna',
    location: 'İki kaş arası',
    color: '#5b3ed9',
    element: 'Işık',
    represents: 'Sezgi, içgörü, hayal gücü, bilgelik.',
    balanced: 'Sezgilerin güçlüdür.',
    imbalanced: 'Karar verememe, sezgisel tıkanıklık.',
  },
  {
    id: 'crown',
    name: 'Taç Çakra',
    sanskrit: 'Sahasrara',
    location: 'Başın tepesi',
    color: '#c79dff',
    element: 'Evren',
    represents: 'Evrensel bağlantı, aydınlanma, spiritüel farkındalık.',
    balanced: 'Bütünle bağlı hissedersin.',
    imbalanced: 'Kopukluk, anlamsızlık hissi.',
  },
];
