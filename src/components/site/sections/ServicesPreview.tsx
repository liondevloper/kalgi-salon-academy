import { useState } from "react";
import { Scissors } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str } from "@/lib/data.ts";
import { rupees } from "@/lib/site-utils.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import SiteLink from "../SiteLink.tsx";
import Section from "../Section.tsx";

// Category chips filter the list; "limit" shows a short preview on the home page
export function ServicesGrid({ limit }: { limit?: number }) {
  const { data, L, t } = useSite();
  const [active, setActive] = useState("all");
  const categories = data.items.category ?? [];
  const services = data.items.service ?? [];
  const filtered = active === "all" ? services : services.filter((s) => str(s.data.category) === active);
  const shown = limit ? filtered.slice(0, limit) : filtered;
  const chips = [{ key: "all", label: t("all") }, ...categories.map((c) => ({ key: str(c.data.key), label: L(c.data.name) }))];

  return (
    <div className="space-y-5">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            aria-pressed={active === c.key}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              active === c.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-muted-foreground">{t("nothingYet")}</p>
      ) : (
        <ul className="grid gap-3 @md:grid-cols-2 @4xl:grid-cols-3">
          {shown.map((s) => {
            const price = str(s.data.price);
            const badge = L(s.data.badge);
            return (
              <li key={s._id} className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-4 shadow-[var(--t-shadow)]">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Scissors className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate font-semibold", HEADING)}>{L(s.data.name)}</p>
                  <p className="text-xs text-muted-foreground">
                    {price ? rupees(Number(price) || price) : t("priceOnRequest")}
                    {str(s.data.duration) && ` · ${str(s.data.duration)}`}
                  </p>
                </div>
                {badge && <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">{badge}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ServicesPreview() {
  const { t } = useSite();
  return (
    <Section
      id="services"
      title={t("ourServices")}
      action={<SiteLink to="/services" className={btnClass("ghost", "px-3 py-2")}>{t("viewAll")}</SiteLink>}
    >
      <ServicesGrid limit={6} />
    </Section>
  );
}
