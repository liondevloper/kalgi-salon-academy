import { BadgePercent, Gift } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { num, str, type Item } from "@/lib/data.ts";
import { activeOffers, rupees } from "@/lib/site-utils.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import SiteLink from "../SiteLink.tsx";
import Tilt from "../Tilt.tsx";
import Section from "../Section.tsx";

export function OfferCard({ offer }: { offer: Item }) {
  const { L, t } = useSite();
  const d = offer.data;
  const end = str(d.endDate);
  const old = num(d.oldPrice);
  return (
    <Tilt className="relative flex flex-col gap-3 overflow-hidden p-6">
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
        <BadgePercent className="size-3.5" /> {t("specialOffer")}
      </span>
      <h3 className={cn("text-2xl", HEADING)}>{L(d.title)}</h3>
      <p className="text-muted-foreground">{L(d.desc)}</p>
      {L(d.bonus) && (
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Gift className="size-4 text-primary" /> {L(d.bonus)}
        </p>
      )}
      <div className="flex items-baseline gap-3">
        {num(d.price) > 0 && <span className={cn("text-3xl font-bold text-primary", HEADING)}>{rupees(d.price)}</span>}
        {old > 0 && <span className="text-muted-foreground line-through">{rupees(old)}</span>}
      </div>
      {end && (
        <p className="text-xs text-muted-foreground">
          {t("validTill")}: {new Date(`${end}T00:00:00`).toLocaleDateString()}
        </p>
      )}
      <SiteLink to="/book" className={btnClass("primary", "mt-auto")}>{t("bookNow")}</SiteLink>
    </Tilt>
  );
}

export default function OffersBanner() {
  const { data, t } = useSite();
  const offers = activeOffers(data.items.offer ?? []);
  if (offers.length === 0) return null;
  return (
    <Section
      id="offers"
      title={t("offers")}
      action={offers.length > 1 ? <SiteLink to="/offers" className={btnClass("ghost", "px-3 py-2")}>{t("viewAll")}</SiteLink> : undefined}
    >
      <div className="grid gap-5 @2xl:grid-cols-2 [perspective:1000px]">
        {offers.slice(0, 2).map((o) => <OfferCard key={o._id} offer={o} />)}
      </div>
    </Section>
  );
}
