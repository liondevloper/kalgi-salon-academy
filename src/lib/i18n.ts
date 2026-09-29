import type { L } from "@/convex/seedData.ts";

export type Locale = "en" | "hi" | "gu";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "hi", label: "हिन्दी" },
  { id: "gu", label: "ગુજરાતી" },
];

export const LOCALE_STORAGE_KEY = "kalgi-locale";

export function isLocale(x: unknown): x is Locale {
  return x === "en" || x === "hi" || x === "gu";
}

// Locale is saved in a cookie and localStorage so "/" opens in the last language
export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000`;
  } catch {
    // storage may be blocked; language still works for this visit
  }
}

export function savedLocale(): Locale {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(v) ? v : "en";
  } catch {
    return "en";
  }
}

const l = (en: string, hi: string, gu: string): L => ({ en, hi, gu });

const UI: Record<string, L> = {
  home: l("Home", "होम", "હોમ"),
  book: l("Book", "बुक", "બુક"),
  services: l("Services", "सर्विसेज़", "સર્વિસ"),
  academy: l("Academy", "एकेडमी", "એકેડમી"),
  bookWhatsapp: l("Book on WhatsApp", "व्हाट्सऐप पर बुक करें", "વોટ્સએપ પર બુક કરો"),
  call: l("Call", "कॉल करें", "કૉલ કરો"),
  since: l("Since 1994", "1994 से", "1994 થી"),
  reviewsWord: l("reviews", "रिव्यू", "રિવ્યૂ"),
  offers: l("Offers", "ऑफर्स", "ઓફર્સ"),
  aboutUs: l("About us", "हमारे बारे में", "અમારા વિશે"),
  viewAll: l("View all", "सभी देखें", "બધું જુઓ"),
  all: l("All", "सभी", "બધા"),
  ourServices: l("Our services", "हमारी सर्विसेज़", "અમારી સર્વિસ"),
  bridalPackages: l("Bridal packages", "ब्राइडल पैकेज", "બ્રાઇડલ પેકેજ"),
  gallery: l("Gallery", "गैलरी", "ગેલેરી"),
  beforeAfter: l("Before & after", "पहले और बाद", "પહેલાં અને પછી"),
  ourAcademy: l("Kalgi Academy", "कलगी एकेडमी", "કલગી એકેડમી"),
  team: l("Our team", "हमारी टीम", "અમારી ટીમ"),
  testimonials: l("What clients say", "क्लाइंट्स क्या कहते हैं", "ગ્રાહકો શું કહે છે"),
  reviewUs: l("Review us on Google", "गूगल पर रिव्यू दें", "ગૂગલ પર રિવ્યૂ આપો"),
  faq: l("Questions answered", "अक्सर पूछे जाने वाले सवाल", "વારંવાર પૂછાતા પ્રશ્નો"),
  contact: l("Visit us", "हमसे मिलें", "અમને મળો"),
  callUs: l("Call us", "हमें कॉल करें", "અમને કૉલ કરો"),
  hours: l("Opening hours", "खुलने का समय", "ખુલવાનો સમય"),
  directions: l("Get directions", "रास्ता देखें", "રસ્તો જુઓ"),
  address: l("Address", "पता", "સરનામું"),
  appointmentNote: l(
    "Prior appointment required. Parking available. Good for kids.",
    "पहले से अपॉइंटमेंट ज़रूरी है। पार्किंग उपलब्ध। बच्चों के लिए अच्छा।",
    "અગાઉથી એપોઇન્ટમેન્ટ જરૂરી. પાર્કિંગ ઉપલબ્ધ. બાળકો માટે સારું.",
  ),
  mon: l("Monday", "सोमवार", "સોમવાર"),
  tue: l("Tuesday", "मंगलवार", "મંગળવાર"),
  wed: l("Wednesday", "बुधवार", "બુધવાર"),
  thu: l("Thursday", "गुरुवार", "ગુરુવાર"),
  fri: l("Friday", "शुक्रवार", "શુક્રવાર"),
  sat: l("Saturday", "शनिवार", "શનિવાર"),
  sun: l("Sunday", "रविवार", "રવિવાર"),
  name: l("Your name", "आपका नाम", "તમારું નામ"),
  phone: l("Phone number", "फ़ोन नंबर", "ફોન નંબર"),
  service: l("Service", "सर्विस", "સર્વિસ"),
  selectService: l("Select a service", "सर्विस चुनें", "સર્વિસ પસંદ કરો"),
  date: l("Date", "तारीख", "તારીખ"),
  time: l("Time", "समय", "સમય"),
  selectTime: l("Select time", "समय चुनें", "સમય પસંદ કરો"),
  message: l("Message (optional)", "संदेश (वैकल्पिक)", "સંદેશ (વૈકલ્પિક)"),
  submitBooking: l("Request appointment", "अपॉइंटमेंट माँगें", "એપોઇન્ટમેન્ટ માંગો"),
  sending: l("Sending...", "भेज रहे हैं...", "મોકલી રહ્યા છીએ..."),
  sendWhatsapp: l("Send on WhatsApp", "व्हाट्सऐप पर भेजें", "વોટ્સએપ પર મોકલો"),
  bookingThanks: l(
    "Thank you! We received your request and will confirm shortly.",
    "धन्यवाद! हमें आपकी रिक्वेस्ट मिल गई है, जल्द ही कन्फर्म करेंगे।",
    "આભાર! તમારી વિનંતી મળી ગઈ છે, જલ્દી કન્ફર્મ કરીશું.",
  ),
  bookTitle: l("Book your appointment", "अपनी अपॉइंटमेंट बुक करें", "તમારી એપોઇન્ટમેન્ટ બુક કરો"),
  enquireTitle: l("Enquire about a course", "कोर्स के बारे में पूछें", "કોર્સ વિશે પૂછો"),
  course: l("Course", "कोर्स", "કોર્સ"),
  anyCourse: l("Any course", "कोई भी कोर्स", "કોઈપણ કોર્સ"),
  enquire: l("Enquire now", "अभी पूछें", "હમણાં પૂછો"),
  duration: l("Duration", "अवधि", "સમયગાળો"),
  fee: l("Fee", "फ़ीस", "ફી"),
  bookNow: l("Book now", "अभी बुक करें", "હમણાં બુક કરો"),
  validTill: l("Valid till", "मान्य तिथि", "માન્ય તારીખ"),
  noOffers: l("No offers right now. Check back soon.", "अभी कोई ऑफर नहीं है। जल्द दोबारा देखें।", "હાલ કોઈ ઓફર નથી. ફરી જુઓ."),
  nothingYet: l("Nothing here yet.", "अभी यहाँ कुछ नहीं है।", "અહીં હજી કંઈ નથી."),
  privacy: l("Privacy policy", "प्राइवेसी पॉलिसी", "પ્રાઇવસી પોલિસી"),
  demoRibbon: l("Demo preview", "डेमो प्रीव्यू", "ડેમો પ્રીવ્યૂ"),
  invalid: l("Please check the highlighted fields", "कृपया हाईलाइट किए गए फ़ील्ड जाँचें", "કૃપા કરીને હાઇલાઇટ કરેલા ફીલ્ડ તપાસો"),
  failed: l("Could not send. Please try again.", "भेज नहीं सके। फिर कोशिश करें।", "મોકલી શક્યા નહીં. ફરી પ્રયાસ કરો."),
  previewOnly: l("Preview only, nothing was saved.", "सिर्फ़ प्रीव्यू, कुछ सेव नहीं हुआ।", "ફક્ત પ્રીવ્યૂ, કંઈ સેવ થયું નથી."),
  whatsappGreeting: l("Hello Kalgi Salon", "नमस्ते कलगी सैलून", "નમસ્તે કલગી સલૂન"),
};

export function ui(key: string, locale: Locale): string {
  const entry = UI[key];
  if (!entry) return key;
  return entry[locale] || entry.en;
}
