import Section from "@/components/site/Section.tsx";
import { OfferCard } from "@/components/site/sections/OffersBanner.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { activeOffers } from "@/lib/site-utils.ts";

export default function OffersPage() {
  const { t, data } = useSite();
  const offers = activeOffers(data.items.offer ?? []);
  return (
    <Section title={t("offers")}>
      {offers.length === 0 ? (
        <p className="text-muted-foreground">{t("noOffers")}</p>
      ) : (
        <div className="grid gap-5 @2xl:grid-cols-2">
          {offers.map((o) => <OfferCard key={o._id} offer={o} />)}
        </div>
      )}
    </Section>
  );
}
