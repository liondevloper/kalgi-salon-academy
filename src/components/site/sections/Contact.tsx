import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { str, telLink } from "@/lib/data.ts";
import { DAY_KEYS } from "@/lib/site-utils.ts";
import { btnClass } from "../button-3d.ts";
import Section from "../Section.tsx";

const cap = (k: string) => k.charAt(0).toUpperCase() + k.slice(1);

export default function Contact() {
  const { site, L, t, preview } = useSite();
  const q = encodeURIComponent(str(site.mapQuery));
  return (
    <Section id="contact" title={t("contact")}>
      <div className="grid gap-6 @2xl:grid-cols-2">
        <div className="grid content-start gap-5 rounded-[var(--radius)] border border-border bg-card p-6 shadow-[var(--t-shadow)]">
          <div className="flex gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{t("address")}</p>
              <p className="text-sm text-muted-foreground">{L(site.address)}</p>
              <p className="text-xs text-muted-foreground">Plus code: {str(site.plusCode)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="mt-1 size-5 shrink-0 text-primary" />
            <div className="flex flex-col text-sm">
              <p className="font-semibold">{t("callUs")}</p>
              {[str(site.phone1), str(site.phone2)].filter(Boolean).map((p) => (
                <a key={p} href={telLink(p)} className="text-muted-foreground underline">{p}</a>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="mt-1 size-5 shrink-0 text-primary" />
            <div className="w-full text-sm">
              <p className="font-semibold">{t("hours")}</p>
              <ul className="mt-1 grid gap-0.5 text-muted-foreground">
                {DAY_KEYS.map((d) => (
                  <li key={d} className="flex justify-between gap-3"><span>{t(d)}</span><span>{str(site[`h${cap(d)}`])}</span></li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">{t("appointmentNote")}</p>
            </div>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer"
            onClick={preview ? (e) => e.preventDefault() : undefined} className={btnClass("primary")}>
            <Navigation className="size-4" /> {t("directions")}
          </a>
        </div>
        <div className="min-h-72 overflow-hidden rounded-[var(--radius)] border border-border shadow-[var(--t-shadow)]">
          {preview ? (
            <div className="grid h-full min-h-72 place-items-center bg-secondary text-muted-foreground"><MapPin className="size-10" /></div>
          ) : (
            <iframe title="Map" loading="lazy" src={`https://www.google.com/maps?q=${q}&output=embed`} className="h-full min-h-72 w-full border-0" />
          )}
        </div>
      </div>
    </Section>
  );
}
