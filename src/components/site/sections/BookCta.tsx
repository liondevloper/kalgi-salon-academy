import { CalendarCheck, MessageCircle } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str, waLink } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import SiteLink from "../SiteLink.tsx";

export default function BookCta() {
  const { site, L, t, preview } = useSite();
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 @2xl:px-8">
      <div className="relative overflow-hidden rounded-[calc(var(--radius)+8px)] bg-primary p-8 text-center text-primary-foreground shadow-[var(--t-shadow)] @2xl:p-14">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-accent/30 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-background/15 blur-2xl" />
        <div className="relative space-y-4">
          <h2 className={cn("text-balance text-3xl @2xl:text-5xl", HEADING)}>
            {L({ en: "Ready for your glow up?", hi: "अपने नए लुक के लिए तैयार?", gu: "તમારા નવા લુક માટે તૈયાર?" })}
          </h2>
          <p className="mx-auto max-w-xl opacity-85">
            {L({ en: "Book your appointment today. Walk in looking good, walk out feeling amazing.", hi: "आज ही अपॉइंटमेंट बुक करें।", gu: "આજે જ એપોઇન્ટમેન્ટ બુક કરો." })}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <SiteLink to="/book" className={btnClass("secondary")}>
              <CalendarCheck className="size-4" /> {t("book")}
            </SiteLink>
            <a href={waLink(str(site.whatsapp), t("whatsappGreeting"))} target="_blank" rel="noreferrer"
              onClick={preview ? (e) => e.preventDefault() : undefined} className={btnClass("ghost", "text-primary-foreground")}>
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
