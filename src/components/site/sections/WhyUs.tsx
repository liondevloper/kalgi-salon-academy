import { BadgeCheck, Gem, ShieldCheck, Sparkles, Wallet, Clock } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { layoutFor } from "@/lib/theme-layouts.ts";
import { cn } from "@/lib/utils.ts";
import Section from "../Section.tsx";

const POINTS = [
  { icon: Gem, t: { en: "Premium products", hi: "प्रीमियम प्रोडक्ट्स", gu: "પ્રીમિયમ પ્રોડક્ટ્સ" }, d: { en: "Only trusted professional brands.", hi: "सिर्फ भरोसेमंद प्रोफेशनल ब्रांड।", gu: "ફક્ત વિશ્વસનીય પ્રોફેશનલ બ્રાન્ડ." } },
  { icon: BadgeCheck, t: { en: "Trained experts", hi: "ट्रेंड एक्सपर्ट्स", gu: "તાલીમબદ્ધ એક્સપર્ટ્સ" }, d: { en: "Stylists trained at our own academy.", hi: "हमारी अपनी एकेडमी से ट्रेंड स्टाइलिस्ट।", gu: "અમારી એકેડમીમાં તાલીમ પામેલા સ્ટાઇલિસ્ટ." } },
  { icon: ShieldCheck, t: { en: "Hygiene first", hi: "साफ़-सफ़ाई पहले", gu: "સ્વચ્છતા પહેલા" }, d: { en: "Sanitised tools for every client.", hi: "हर ग्राहक के लिए साफ़ औज़ार।", gu: "દરેક ગ્રાહક માટે સ્વચ્છ સાધનો." } },
  { icon: Wallet, t: { en: "Affordable luxury", hi: "किफ़ायती लक्ज़री", gu: "પરવડે તેવી લક્ઝરી" }, d: { en: "Luxury experience at fair prices.", hi: "सही दाम में लक्ज़री अनुभव।", gu: "યોગ્ય ભાવે લક્ઝરી અનુભવ." } },
  { icon: Sparkles, t: { en: "Women only", hi: "सिर्फ महिलाओं के लिए", gu: "ફક્ત મહિલાઓ માટે" }, d: { en: "A comfortable, private space.", hi: "आरामदायक और निजी जगह।", gu: "આરામદાયક અને ખાનગી જગ્યા." } },
  { icon: Clock, t: { en: "Open all 7 days", hi: "सातों दिन खुला", gu: "સાતેય દિવસ ખુલ્લું" }, d: { en: "10 AM to 8 PM, including Sunday.", hi: "रविवार सहित सुबह 10 से रात 8।", gu: "રવિવાર સહિત સવારે 10 થી રાત્રે 8." } },
];

export default function WhyUs() {
  const { L, themeId } = useSite();
  const cards = layoutFor(themeId).cards;
  const title = L({ en: "Why choose Kalgi", hi: "कलगी ही क्यों", gu: "કલગી જ કેમ" });
  return (
    <Section id="why-us" title={title}>
      <div className={cn("grid gap-4", cards === "list" ? "@2xl:grid-cols-2" : "grid-cols-2 @2xl:grid-cols-3")}>
        {POINTS.map(({ icon: Icon, t, d }) => (
          <div key={t.en} className={cn(
            "rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--t-shadow)]",
            cards === "list" && "flex items-start gap-4",
            cards === "bold" && "border-2 border-primary",
          )}>
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground", cards !== "list" && "mb-3")}>
              <Icon className="size-5" />
            </span>
            <div>
              <p className={cn("text-lg", HEADING)}>{L(t)}</p>
              <p className="text-sm text-muted-foreground">{L(d)}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
