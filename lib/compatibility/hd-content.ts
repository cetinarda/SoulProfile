import type { HDCenter } from '../human-design/gates';

export const CENTER_TR: Record<HDCenter, string> = {
  Head: 'Baş (İlham)',
  Ajna: 'Anja (Zihin)',
  Throat: 'Boğaz (İfade)',
  G: 'G Merkezi (Kimlik & Sevgi)',
  Heart: 'Kalp / Ego (İrade)',
  SolarPlexus: 'Solar Plexus (Duygular)',
  Sacral: 'Sakral (Yaşam Gücü)',
  Spleen: 'Dalak (Sezgi & Sağlık)',
  Root: 'Kök (Baskı & İvme)',
};

export const CENTER_THEME: Record<HDCenter, string> = {
  Head: 'ilham, sorular ve zihinsel baskı',
  Ajna: 'kavramlaştırma, kesinlik ve düşünme biçimi',
  Throat: 'ifade, iletişim ve eyleme dökme',
  G: 'kimlik, yön, sevgi ve aidiyet',
  Heart: 'irade gücü, değer, söz tutma ve özgüven',
  SolarPlexus: 'duygusal dalgalar, arzu ve ruh hali',
  Sacral: 'yaşam enerjisi, üretkenlik, cinsellik ve istek',
  Spleen: 'sezgi, anlık farkındalık, sağlık ve güven hissi',
  Root: 'stres, ivme, baskı ve harekete geçme dürtüsü',
};

type RelMeaning = {
  // A tanımlı, B açık (A, B'yi koşullar)
  conditions: string;
  // İkisi de tanımlı
  bothDefined: string;
  // İkisi de açık
  bothOpen: string;
};

export const CENTER_RELATIONSHIP: Record<HDCenter, RelMeaning> = {
  Head: {
    conditions:
      'tanımlı tarafın ilham ve soruları, açık tarafı zihinsel olarak meşgul eder. Açık taraf onun sorularına kapılabilir; sınır koymayı öğrenirse büyük ilham alır.',
    bothDefined:
      'ikiniz de kendi ilham kaynağınıza sahipsiniz. Zihinsel olarak birbirinizden bağımsızsınız; nadiren birbirinizin kafasını karıştırırsınız.',
    bothOpen:
      'ikiniz de dışarıdan gelen sorulara açıksınız. Birlikte "acaba" sarmalına girebilir, sürekli yeni fikirler kovalayabilirsiniz — eğlenceli ama dağıtıcı.',
  },
  Ajna: {
    conditions:
      'tanımlı tarafın sabit düşünme biçimi, açık tarafa kesinlik hissi verir. Açık taraf onun gibi düşünmeye başlayabilir; bu hem güven verir hem de kendi esnek zihnini unutturabilir.',
    bothDefined:
      'ikinizin de sabit görüşleri var. Aynı fikirdeyseniz sarsılmaz bir ittifak, farklıysanız "ben haklıyım" çatışması olabilir.',
    bothOpen:
      'ikiniz de zihinsel olarak esnek ve meraklısınız. Birlikte birçok bakış açısını deneyebilir ama bir karara varmakta zorlanabilirsiniz.',
  },
  Throat: {
    conditions:
      'tanımlı taraf konuşma ve eyleme dökme ritmini belirler; açık taraf onun sesinden etkilenir, bazen söz hakkı bulmakta zorlanır. Bilinçli olunca güzel bir sözcü-dinleyici dengesi kurar.',
    bothDefined:
      'ikinizin de güçlü bir ifade tarzı var. Sesli bir ikilisiniz; ama ikiniz de aynı anda konuşmak isterse söz sırası bir mesele olabilir.',
    bothOpen:
      'ikiniz de ifade için dış ortama göre şekil alırsınız. Beraber sessiz kalabilir ya da doğru ortamda birlikte açılabilirsiniz.',
  },
  G: {
    conditions:
      'tanımlı taraf yön ve kimlik duygusu yayar; açık taraf onun yanında "kim olduğunu" daha net hisseder ama kendi yönünü ona bağlayabilir. Sağlıklı olduğunda derin bir aidiyet doğar.',
    bothDefined:
      'ikinizin de sabit bir kimlik ve yön duygusu var. Birbirinizi nereye gittiğiniz konusunda zorlamazsınız; iki bağımsız pusula yan yana yürür.',
    bothOpen:
      'ikiniz de yönünüzü ve kimliğinizi ortama/çevreye göre bulursunuz. Birlikte doğru "yer"i ararsanız manyetik bir keşif; yanlış ortamda ikiniz de kaybolabilirsiniz.',
  },
  Heart: {
    conditions:
      'tanımlı tarafın irade ve özgüveni, açık tarafa "yetiyor muyum?" baskısı bindirebilir. Açık taraf kendini kanıtlamaya çalışmamayı öğrenirse, tanımlı taraftan büyük cesaret alır.',
    bothDefined:
      'ikinizin de güçlü iradesi ve değer duygusu var. Güç mücadelesine girmemek için söz verme ve rekabeti açıkça konuşmanız gerekir.',
    bothOpen:
      'ikiniz de kendinizi kanıtlama baskısına açıksınız. Birbirinize "olduğun gibi yetersin" diyebilirseniz, bu açıklık bilgeliğe dönüşür.',
  },
  SolarPlexus: {
    conditions:
      'tanımlı tarafın duygusal dalgası evin havasını belirler; açık taraf bu dalgayı emer ve büyütür. Açık taraf "bu duygu bana mı ait?" diye sormayı öğrenirse, ilişki çok daha sakin akar.',
    bothDefined:
      'ikinizin de kendi duygusal dalgası var. İki dalga çakışınca yoğun, ayrı fazda olunca biri inerken diğeri çıkar — netlik için ikinizin de zamana ihtiyacı var.',
    bothOpen:
      'ikiniz de duygusal olarak ortamdan etkilenirsiniz. Çatışmadan kaçma eğiliminiz ortak; gerginliği bastırmak yerine nazikçe adlandırmak ikinizi de özgürleştirir.',
  },
  Sacral: {
    conditions:
      'tanımlı taraf (Generator) sürdürülebilir yaşam enerjisi yayar; açık taraf bu enerjiyi alır ama ne zaman duracağını bilemeyebilir. Açık taraf dinlenmeyi öğrenirse, birlikte çok üretirsiniz.',
    bothDefined:
      'ikinizin de motoru güçlü. Aynı işe sarıldığınızda yorulmadan üretirsiniz; ama ikiniz de "evet" derken bedeninizi dinlemezseniz tükenebilirsiniz.',
    bothOpen:
      'ikiniz de yaşam enerjisini dışarıdan alırsınız. Birlikte ne zaman duracağınızı bilmek kritik; dinlenmeyi ortak bir ritüel yapın.',
  },
  Spleen: {
    conditions:
      'tanımlı tarafın sezgisi ve sağlık-güven duygusu, açık tarafa anlık bir güvenlik hissi verir. Açık taraf ona "iyi hissettiren" şeylere fazla tutunabilir; sağlıklı sınır şart.',
    bothDefined:
      'ikinizin de güçlü, anlık sezgisi var. Tehlikeyi ve fırsatı aynı anda hissedersiniz; sezgisel olarak birbirinize güvenirsiniz.',
    bothOpen:
      'ikiniz de korku ve güven konusunda dışa açıksınız. Birbirinizin "iyi hissettiren ama doğru olmayan" alışkanlıklarını fark etmek, ortak şifa olur.',
  },
  Root: {
    conditions:
      'tanımlı tarafın ivme ve baskı enerjisi, açık tarafı harekete geçirir ama aceleye de sürükleyebilir. Açık taraf "bu acele gerçekten benim mi?" diye sorarsa, sağlıklı bir tempo bulunur.',
    bothDefined:
      'ikinizin de kendi iç ritmi ve baskıyı yönetme biçimi var. Birbirinizi gereksiz aceleye zorlamazsınız; iki ayrı tempo yan yana akar.',
    bothOpen:
      'ikiniz de dış baskıya açıksınız. "Bitirelim de rahatlayalım" tuzağına birlikte düşebilirsiniz; önceliklendirmeyi birlikte öğrenmek özgürleştirir.',
  },
};

/** İki gate'in bağladığı kanalın temasını merkezlerine göre isimlendir */
export function channelTheme(centerA: HDCenter, centerB: HDCenter): string {
  return `${CENTER_TR[centerA]} ↔ ${CENTER_TR[centerB]}`;
}
