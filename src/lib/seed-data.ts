// Demo content used while the database is empty and by the theme preview.
export type L = { en: string; hi: string; gu: string };
const l = (en: string, hi: string, gu: string): L => ({ en, hi, gu });
const none = l("", "", "");

export const KINDS = [
  "category",
  "service",
  "offer",
  "bridal",
  "gallery",
  "course",
  "team",
  "testimonial",
  "faq",
] as const;

export const SECTION_KEYS = [
  "hero",
  "offers",
  "about",
  "services",
  "bridal",
  "gallery",
  "academy",
  "team",
  "testimonials",
  "faq",
  "contact",
] as const;

export const u = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const SEED_SETTINGS: Record<string, Record<string, unknown>> = {
  site: {
    name: "Kalgi Salon & Academy",
    logo: "",
    favicon: "",
    tagline: l(
      "Most Luxurious & Affordable Female Salon",
      "सबसे लक्ज़री और किफ़ायती महिला सैलून",
      "સૌથી લક્ઝરી અને પરવડે તેવું મહિલા સલૂન",
    ),
    line: l(
      "Hair | Bride | Skin | Nails | Classes",
      "हेयर | ब्राइड | स्किन | नेल्स | क्लासेस",
      "હેર | બ્રાઇડ | સ્કિન | નેઇલ્સ | ક્લાસ",
    ),
    phone1: "9376157587",
    phone2: "7041505148",
    whatsapp: "9376157587",
    address: l(
      "305 Trinity Plaza, Near Shanidev Temple, Opp. Reliance Fresh, Shahibaug, Ahmedabad, Gujarat 380004",
      "305 ट्रिनिटी प्लाज़ा, शनिदेव मंदिर के पास, रिलायंस फ्रेश के सामने, शाहीबाग, अहमदाबाद, गुजरात 380004",
      "305 ટ્રિનિટી પ્લાઝા, શનિદેવ મંદિર પાસે, રિલાયન્સ ફ્રેશ સામે, શાહીબાગ, અમદાવાદ, ગુજરાત 380004",
    ),
    plusCode: "3H2V+C5",
    mapQuery: "Kalgi Salon Trinity Plaza Shahibaug Ahmedabad 380004",
    instagram: "https://www.instagram.com/kalgi_salon/",
    hMon: "10 AM – 8 PM",
    hTue: "10 AM – 8 PM",
    hWed: "10 AM – 8 PM",
    hThu: "10 AM – 8 PM",
    hFri: "10 AM – 8 PM",
    hSat: "10 AM – 8 PM",
    hSun: "10 AM – 8 PM",
    rating: 4.8,
    reviewCount: 1289,
    reviewLink:
      "https://www.google.com/maps/search/?api=1&query=Kalgi+Salon+Trinity+Plaza+Ahmedabad",
    footer: l(
      "Redefine your beauty. Since 1994.",
      "अपनी सुंदरता को नए सिरे से निखारें। 1994 से।",
      "તમારી સુંદરતાને નવી રીતે નિખારો. 1994 થી.",
    ),
    demoMode: true,
  },
  hero: {
    headline: l(
      "Most Luxurious & Affordable Female Salon",
      "सबसे लक्ज़री और किफ़ायती महिला सैलून",
      "સૌથી લક્ઝરી અને પરવડે તેવું મહિલા સલૂન",
    ),
    sub: l(
      "Hair | Bride | Skin | Nails | Classes",
      "हेयर | ब्राइड | स्किन | नेल्स | क्लासेस",
      "હેર | બ્રાઇડ | સ્કિન | નેઇલ્સ | ક્લાસ",
    ),
    image: u("1634449571010-02389ed0f9b0"),
  },
  about: {
    title: l("About us", "हमारे बारे में", "અમારા વિશે"),
    body: l(
      "Redefine your beauty. New name, facilities, location with same quality, trust.",
      "अपनी सुंदरता को नए सिरे से निखारें। नया नाम, नई सुविधाएँ, नई जगह - वही गुणवत्ता, वही भरोसा।",
      "તમારી સુંદરતાને નવી રીતે નિખારો. નવું નામ, નવી સુવિધાઓ, નવું સ્થાન - એ જ ગુણવત્તા, એ જ વિશ્વાસ.",
    ),
    image: u("1781450090585-1a511b7066d9"),
    stat1Value: 30,
    stat1Suffix: "+",
    stat1Label: l("Years of trust", "साल का भरोसा", "વર્ષનો વિશ્વાસ"),
    stat2Value: 1289,
    stat2Suffix: "",
    stat2Label: l("Google reviews", "गूगल रिव्यू", "ગૂગલ રિવ્યૂ"),
    stat3Value: 4.8,
    stat3Suffix: "",
    stat3Label: l("Google rating", "गूगल रेटिंग", "ગૂગલ રેટિંગ"),
    stat4Value: 5,
    stat4Suffix: "",
    stat4Label: l("Service categories", "सर्विस कैटेगरी", "સર્વિસ કેટેગરી"),
  },
  theme: { active: "modern-minimal", overrides: {} },
  sections: { list: SECTION_KEYS.map((key) => ({ key, visible: true })) },
  seo: {
    ga4: "",
    ogImage: "",
    homeTitle: "Kalgi Salon & Academy | Female Salon in Ahmedabad",
    homeDesc:
      "Most luxurious and affordable female salon in Shahibaug, Ahmedabad. Hair, bridal, skin, nails and beauty classes since 1994.",
    bookTitle: "Book an appointment | Kalgi Salon",
    bookDesc: "Book your salon appointment online.",
    servicesTitle: "Services | Kalgi Salon",
    servicesDesc: "Hair, skin, bridal, nails, waxing and threading services.",
    academyTitle: "Beauty Academy | Kalgi Salon & Academy",
    academyDesc: "Beauty, advance, diploma and short term courses.",
    offersTitle: "Offers | Kalgi Salon",
    offersDesc: "Current offers at Kalgi Salon.",
    galleryTitle: "Gallery | Kalgi Salon",
    galleryDesc: "Our work: hair, bridal, skin and nails.",
    contactTitle: "Contact | Kalgi Salon",
    contactDesc: "Find us at Trinity Plaza, Shahibaug, Ahmedabad.",
  },
};

type SeedItem = { kind: string; visible: boolean; data: Record<string, unknown> };

const cat = (key: string, name: L): SeedItem => ({
  kind: "category",
  visible: true,
  data: { key, name },
});
const svc = (category: string, en: string, hi: string, gu: string): SeedItem => ({
  kind: "service",
  visible: true,
  data: { category, name: l(en, hi, gu), price: "", duration: "", badge: none },
});

const GALLERY_IDS = [
  "1580618672591-eb180b1a973f",
  "1610173827043-9db50e0d8ef9",
  "1570172619644-dfd03ed5d881",
  "1519014816548-bf5fe059798b",
  "1562322140-8baeececf3df",
  "1616394584738-fc6e612e71b9",
];
const TEAM_IDS = [
  "1695527081848-1e46c06e6458",
  "1552693673-1bf958298935",
  "1588842867976-fd084ca2c87b",
];

const SERVICES: SeedItem[] = [
  svc("hair", "Haircut", "हेयरकट", "હેરકટ"),
  svc("hair", "Advance Hair Cutting", "एडवांस हेयर कटिंग", "એડવાન્સ હેર કટિંગ"),
  svc("hair", "Blow dry", "ब्लो ड्राई", "બ્લો ડ્રાય"),
  svc("hair", "Hairstyling", "हेयरस्टाइलिंग", "હેરસ્ટાઇલિંગ"),
  svc("hair", "Hair Setting", "हेयर सेटिंग", "હેર સેટિંગ"),
  svc("hair", "Hot Rollers", "हॉट रोलर्स", "હોટ રોલર્સ"),
  svc("hair", "Ironing/Crimping", "आयरनिंग/क्रिम्पिंग", "આયર્નિંગ/ક્રિમ્પિંગ"),
  svc("hair", "Out Curls", "आउट कर्ल्स", "આઉટ કર્લ્સ"),
  svc("hair", "Global Color", "ग्लोबल कलर", "ગ્લોબલ કલર"),
  svc("hair", "Fashion Color Highlighting", "फैशन कलर हाइलाइटिंग", "ફેશન કલર હાઇલાઇટિંગ"),
  svc("hair", "Root Touch Up", "रूट टच अप", "રૂટ ટચ અપ"),
  svc("hair", "Balayage", "बालायाज", "બાલયાજ"),
  svc("hair", "Smoothening", "स्मूदनिंग", "સ્મૂધનિંગ"),
  svc("hair", "Keratin", "केराटिन", "કેરાટિન"),
  svc("hair", "Dandruff/Hair Loss treatment", "रूसी/बाल झड़ना उपचार", "ડેન્ડ્રફ/વાળ ખરવાની સારવાર"),
  svc("skin", "Facials", "फेशियल", "ફેશિયલ"),
  svc("skin", "Acne treatments", "एक्ने ट्रीटमेंट", "ખીલની સારવાર"),
  svc("skin", "Anti Aging", "एंटी एजिंग", "એન્ટી એજિંગ"),
  svc("skin", "Anti Pigmentation", "एंटी पिगमेंटेशन", "એન્ટી પિગમેન્ટેશન"),
  svc("skin", "Whitening Therapy", "व्हाइटनिंग थेरेपी", "વ્હાઇટનિંગ થેરાપી"),
  svc("skin", "Stemcell Therapy", "स्टेमसेल थेरेपी", "સ્ટેમસેલ થેરાપી"),
  svc("skin", "Stone Therapy", "स्टोन थेरेपी", "સ્ટોન થેરાપી"),
  svc("skin", "Ultra Lite Therapy", "अल्ट्रा लाइट थेरेपी", "અલ્ટ્રા લાઇટ થેરાપી"),
  svc("skin", "Lift Treatment", "लिफ्ट ट्रीटमेंट", "લિફ્ટ ટ્રીટમેન્ટ"),
  svc("skin", "Non Surgical", "नॉन सर्जिकल", "નોન સર્જિકલ"),
  svc("skin", "Eye Lift", "आई लिफ्ट", "આઈ લિફ્ટ"),
  svc("bridal", "Bridal services", "ब्राइडल सर्विसेज", "બ્રાઇડલ સર્વિસ"),
  svc("bridal", "Saree Draping", "साड़ी ड्रेपिंग", "સાડી ડ્રેપિંગ"),
  svc("bridal", "Ring Ceremony", "रिंग सेरेमनी", "રિંગ સેરેમની"),
  svc("nails", "Gel Nail", "जेल नेल", "જેલ નેઇલ"),
  svc("nails", "Artificial Nail Fixing", "आर्टिफिशियल नेल फिक्सिंग", "આર્ટિફિશિયલ નેઇલ ફિક્સિંગ"),
  svc("nails", "French Nail Polish", "फ्रेंच नेल पॉलिश", "ફ્રેન્ચ નેઇલ પોલિશ"),
  svc("nails", "Bridal Nail Art", "ब्राइडल नेल आर्ट", "બ્રાઇડલ નેઇલ આર્ટ"),
  svc("waxing", "Body waxing", "बॉडी वैक्सिंग", "બોડી વેક્સિંગ"),
  svc("waxing", "Eyebrow beautification", "आईब्रो ब्यूटिफिकेशन", "આઇબ્રો બ્યુટિફિકેશન"),
  svc("waxing", "Lash lift", "लैश लिफ्ट", "લેશ લિફ્ટ"),
  svc("waxing", "Eyelashes", "आईलैशेज़", "આઈલેશીસ"),
];

const course = (en: string, hi: string, gu: string, d: L): SeedItem => ({
  kind: "course",
  visible: true,
  data: { name: l(en, hi, gu), desc: d, duration: "", fee: "" },
});

export const SEED_ITEMS: SeedItem[] = [
  cat("hair", l("Hair", "हेयर", "હેર")),
  cat("skin", l("Skin", "स्किन", "સ્કિન")),
  cat("bridal", l("Bridal", "ब्राइडल", "બ્રાઇડલ")),
  cat("nails", l("Nails", "नेल्स", "નેઇલ્સ")),
  cat("waxing", l("Waxing & Threading", "वैक्सिंग और थ्रेडिंग", "વેક્સિંગ અને થ્રેડિંગ")),
  ...SERVICES,
  {
    kind: "offer",
    visible: true,
    data: {
      title: l("New Year Offer", "नए साल का ऑफर", "નવા વર્ષની ઓફર"),
      desc: l(
        "Smoothening, Balayage, Keratin at ₹2999 each",
        "स्मूदनिंग, बालायाज, केराटिन सिर्फ़ ₹2999 प्रत्येक",
        "સ્મૂધનિંગ, બાલયાજ, કેરાટિન દરેક માત્ર ₹2999",
      ),
      bonus: l(
        "Free haircut worth ₹549",
        "₹549 का हेयरकट फ्री",
        "₹549 નો હેરકટ ફ્રી",
      ),
      price: 2999,
      oldPrice: 6000,
      startDate: "",
      endDate: "2027-12-31",
    },
  },
  ...[
    ["Classic Bridal", "क्लासिक ब्राइडल", "ક્લાસિક બ્રાઇડલ"],
    ["Royal Bridal", "रॉयल ब्राइडल", "રોયલ બ્રાઇડલ"],
    ["Pre-Bridal Glow", "प्री-ब्राइडल ग्लो", "પ્રી-બ્રાઇડલ ગ્લો"],
  ].map(
    ([en, hi, gu]): SeedItem => ({
      kind: "bridal",
      visible: true,
      data: {
        name: l(en, hi, gu),
        desc: l(
          "Complete look with makeup, hair and draping by our experts.",
          "हमारे एक्सपर्ट्स द्वारा मेकअप, हेयर और ड्रेपिंग के साथ पूरा लुक।",
          "અમારા એક્સપર્ટ્સ દ્વારા મેકઅપ, હેર અને ડ્રેપિંગ સાથે પૂરો લુક.",
        ),
        price: "",
        features: l(
          "Makeup\nHair styling\nSaree draping\nNail art",
          "मेकअप\nहेयर स्टाइलिंग\nसाड़ी ड्रेपिंग\nनेल आर्ट",
          "મેકઅપ\nહેર સ્ટાઇલિંગ\nસાડી ડ્રેપિંગ\nનેઇલ આર્ટ",
        ),
      },
    }),
  ),
  ...["hair", "bridal", "skin", "nails", "hair", "skin"].map(
    (category, i): SeedItem => ({
      kind: "gallery",
      visible: true,
      data: { type: "photo", category, image: u(GALLERY_IDS[i]), after: "", alt: none },
    }),
  ),
  {
    kind: "gallery",
    visible: true,
    data: {
      type: "beforeafter",
      category: "hair",
      image: u("1629397685944-7073f5589754"),
      after: u("1734111719430-fe4a3973f8af"),
      alt: none,
    },
  },
  course(
    "Beauty Courses",
    "ब्यूटी कोर्सेज़",
    "બ્યુટી કોર્સ",
    l("Learn salon basics from experts.", "एक्सपर्ट्स से सैलून की बेसिक्स सीखें।", "એક્સપર્ટ્સ પાસેથી સલૂનની બેઝિક્સ શીખો."),
  ),
  course(
    "Advance Course",
    "एडवांस कोर्स",
    "એડવાન્સ કોર્સ",
    l("Advanced techniques for hair, skin and makeup.", "हेयर, स्किन और मेकअप की एडवांस तकनीकें।", "હેર, સ્કિન અને મેકઅપની એડવાન્સ ટેકનિક."),
  ),
  course(
    "Diploma Course",
    "डिप्लोमा कोर्स",
    "ડિપ્લોમા કોર્સ",
    l("Complete career-ready diploma program.", "करियर के लिए पूरा डिप्लोमा प्रोग्राम।", "કારકિર્દી માટે સંપૂર્ણ ડિપ્લોમા પ્રોગ્રામ."),
  ),
  course(
    "Short Term Courses",
    "शॉर्ट टर्म कोर्सेज़",
    "શોર્ટ ટર્મ કોર્સ",
    l("Quick skill-based classes in a few weeks.", "कुछ हफ़्तों में स्किल-आधारित क्लासेस।", "થોડા અઠવાડિયામાં સ્કિલ આધારિત ક્લાસ."),
  ),
  ...[
    ["Senior Hair Stylist", "सीनियर हेयर स्टाइलिस्ट", "સિનિયર હેર સ્ટાઇલિસ્ટ"],
    ["Skin Expert", "स्किन एक्सपर्ट", "સ્કિન એક્સપર્ટ"],
    ["Bridal Makeup Artist", "ब्राइडल मेकअप आर्टिस्ट", "બ્રાઇડલ મેકઅપ આર્ટિસ્ટ"],
  ].map(
    ([en, hi, gu], i): SeedItem => ({
      kind: "team",
      visible: true,
      data: {
        name: l("Our Expert", "हमारी एक्सपर्ट", "અમારી એક્સપર્ટ"),
        role: l(en, hi, gu),
        photo: u(TEAM_IDS[i]),
        bio: none,
      },
    }),
  ),
  ...[
    ["Priya", "Lovely place, very professional staff and great results."],
    ["Neha", "Best salon in Shahibaug. Affordable and luxurious."],
    ["Riya", "My bridal look was perfect. Highly recommended!"],
  ].map(
    ([name, text]): SeedItem => ({
      kind: "testimonial",
      visible: true,
      data: { type: "text", name, text: l(text, text, text), rating: 5, image: "" },
    }),
  ),
  {
    kind: "testimonial",
    visible: true,
    data: { type: "screenshot", name: "Google review", text: none, rating: 5, image: "" },
  },
  {
    kind: "faq",
    visible: true,
    data: {
      q: l("Do I need an appointment?", "क्या अपॉइंटमेंट ज़रूरी है?", "શું એપોઇન્ટમેન્ટ જરૂરી છે?"),
      a: l(
        "Yes, prior appointment is required. Call or WhatsApp us to book.",
        "हाँ, पहले से अपॉइंटमेंट ज़रूरी है। बुक करने के लिए कॉल या व्हाट्सऐप करें।",
        "હા, અગાઉથી એપોઇન્ટમેન્ટ જરૂરી છે. બુક કરવા કૉલ અથવા વોટ્સએપ કરો.",
      ),
    },
  },
  {
    kind: "faq",
    visible: true,
    data: {
      q: l("Are you open on Sunday?", "क्या आप रविवार को खुले हैं?", "શું તમે રવિવારે ખુલ્લા છો?"),
      a: l(
        "Yes, we are open every day, including Sunday, 10 AM to 8 PM.",
        "हाँ, हम रविवार सहित हर दिन सुबह 10 से शाम 8 बजे तक खुले हैं।",
        "હા, અમે રવિવાર સહિત દરરોજ સવારે 10 થી સાંજે 8 સુધી ખુલ્લા છીએ.",
      ),
    },
  },
  {
    kind: "faq",
    visible: true,
    data: {
      q: l("Is parking available?", "क्या पार्किंग उपलब्ध है?", "શું પાર્કિંગ ઉપલબ્ધ છે?"),
      a: l("Yes, parking is available.", "हाँ, पार्किंग उपलब्ध है।", "હા, પાર્કિંગ ઉપલબ્ધ છે."),
    },
  },
  {
    kind: "faq",
    visible: true,
    data: {
      q: l("Is it good for kids?", "क्या यह बच्चों के लिए अच्छा है?", "શું આ બાળકો માટે સારું છે?"),
      a: l("Yes, our salon is kid friendly.", "हाँ, हमारा सैलून बच्चों के अनुकूल है।", "હા, અમારું સલૂન બાળકો માટે અનુકૂળ છે."),
    },
  },
  {
    kind: "faq",
    visible: true,
    data: {
      q: l("Do you run beauty courses?", "क्या आप ब्यूटी कोर्स चलाते हैं?", "શું તમે બ્યુટી કોર્સ ચલાવો છો?"),
      a: l(
        "Yes. Kalgi Academy offers beauty, advance, diploma and short term courses.",
        "हाँ। कलगी एकेडमी में ब्यूटी, एडवांस, डिप्लोमा और शॉर्ट टर्म कोर्स हैं।",
        "હા. કલગી એકેડમીમાં બ્યુટી, એડવાન્સ, ડિપ્લોમા અને શોર્ટ ટર્મ કોર્સ છે.",
      ),
    },
  },
];
