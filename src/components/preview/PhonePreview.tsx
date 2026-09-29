import { useState } from "react";
import { SiteProvider } from "@/lib/site-context.tsx";
import { seedSiteData, type SiteData } from "@/lib/data.ts";
import { resolveTokens, themeStyle, type ThemeTokens } from "@/lib/themes.ts";
import { isLocale, type Locale } from "@/lib/i18n.ts";
import SiteShell from "@/components/site/SiteShell.tsx";
import HomeSections from "@/components/site/HomeSections.tsx";
import BookingForm from "@/components/site/BookingForm.tsx";
import EnquiryForm from "@/components/site/EnquiryForm.tsx";
import Section from "@/components/site/Section.tsx";
import Contact from "@/components/site/sections/Contact.tsx";
import { ServicesGrid } from "@/components/site/sections/ServicesPreview.tsx";
import { CourseGrid } from "@/components/site/sections/AcademyPreview.tsx";
import { OfferCard } from "@/components/site/sections/OffersBanner.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { activeOffers } from "@/lib/site-utils.ts";
import type { ThemeId } from "@/lib/themes.ts";

export const SCREENS = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/book", label: "Book" },
  { path: "/academy", label: "Academy" },
  { path: "/offers", label: "Offers" },
  { path: "/contact", label: "Contact" },
] as const;

function ScreenBody({ path }: { path: string }) {
  const { t, data } = useSite();
  switch (path) {
    case "/services":
      return <Section title={t("ourServices")}><ServicesGrid /></Section>;
    case "/book":
      return <Section title={t("bookTitle")}><BookingForm /></Section>;
    case "/academy":
      return (
        <>
          <Section title={t("ourAcademy")}><CourseGrid /></Section>
          <Section title={t("enquireTitle")}><EnquiryForm /></Section>
        </>
      );
    case "/offers":
      return (
        <Section title={t("offers")}>
          <div className="grid gap-4">
            {activeOffers(data.items.offer ?? []).map((o) => <OfferCard key={o._id} offer={o} />)}
          </div>
        </Section>
      );
    case "/contact":
      return <Contact />;
    default:
      return <HomeSections />;
  }
}

type Props = {
  themeId: ThemeId;
  overrides?: unknown;
  screen: string;
  locale?: Locale;
  data?: SiteData;
  // Fixed screen (gallery of 6) or navigable (single phone)
  navigable?: boolean;
  className?: string;
};

// One themed phone. Same SiteShell + sections as the real site.
export default function PhonePreview({ themeId, overrides, screen, locale = "en", data, navigable, className }: Props) {
  const [path, setPath] = useState(screen);
  const [loc, setLoc] = useState<Locale>(locale);
  const { id, tokens } = resolveTokens(themeId, overrides);
  const shown = navigable ? path : screen;
  const d = data ?? seedSiteData();
  return (
    <div className={className}>
      <div className="mx-auto h-[640px] w-[300px] overflow-hidden rounded-[2.4rem] border-[8px] border-neutral-900 bg-neutral-900 shadow-[0_30px_50px_-15px_rgba(0,0,0,.5)]">
        <div style={themeStyle(tokens)} className="h-full w-full [zoom:0.8]">
          <div className="h-[800px] w-[375px]">
            <SiteProvider
              data={d} locale={loc} setLocale={(l) => isLocale(l) && setLoc(l)} tokens={tokens as ThemeTokens}
              themeId={id} demo={false} preview onPreviewGo={navigable ? setPath : undefined} activePath={shown}
            >
              <SiteShell>
                <ScreenBody path={shown} />
              </SiteShell>
            </SiteProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
