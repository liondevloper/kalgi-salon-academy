import { Check } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str } from "@/lib/data.ts";
import { lines } from "@/lib/site-utils.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import SiteLink from "../SiteLink.tsx";
import Tilt from "../Tilt.tsx";
import Section from "../Section.tsx";

export default function Bridal() {
  const { data, L, t } = useSite();
  const items = data.items.bridal ?? [];
  if (items.length === 0) return null;
  return (
    <Section id="bridal" title={t("bridalPackages")}>
      <div className="grid gap-5 @2xl:grid-cols-3 [perspective:1000px]">
        {items.map((b) => (
          <Tilt key={b._id} className="flex flex-col gap-3 p-6">
            <h3 className={cn("text-2xl", HEADING)}>{L(b.data.name)}</h3>
            <p className="text-sm text-muted-foreground">{L(b.data.desc)}</p>
            <ul className="grid gap-1.5 text-sm">
              {lines(L(b.data.features)).map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="size-4 text-primary" />{f}</li>
              ))}
            </ul>
            {str(b.data.price) && <p className="text-xl font-bold text-primary">{str(b.data.price)}</p>}
            <SiteLink to="/book" className={btnClass("primary", "mt-auto")}>{t("bookNow")}</SiteLink>
          </Tilt>
        ))}
      </div>
    </Section>
  );
}
