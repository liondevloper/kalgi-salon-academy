import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context.tsx";
import { rec } from "@/lib/data.ts";
import { layoutFor } from "@/lib/theme-layouts.ts";
import { cn } from "@/lib/utils.ts";
import Hero from "@/components/site/sections/Hero.tsx";
import OffersBanner from "@/components/site/sections/OffersBanner.tsx";
import About from "@/components/site/sections/About.tsx";
import ServicesPreview from "@/components/site/sections/ServicesPreview.tsx";
import Bridal from "@/components/site/sections/Bridal.tsx";
import Gallery from "@/components/site/sections/Gallery.tsx";
import AcademyPreview from "@/components/site/sections/AcademyPreview.tsx";
import Team from "@/components/site/sections/Team.tsx";
import Testimonials from "@/components/site/sections/Testimonials.tsx";
import Faq from "@/components/site/sections/Faq.tsx";
import Contact from "@/components/site/sections/Contact.tsx";
import Stats from "@/components/site/sections/Stats.tsx";
import WhyUs from "@/components/site/sections/WhyUs.tsx";
import InstagramStrip from "@/components/site/sections/InstagramStrip.tsx";
import BookCta from "@/components/site/sections/BookCta.tsx";

const MAP: Record<string, ReactNode> = {
  hero: <Hero />,
  stats: <Stats />,
  offers: <OffersBanner />,
  about: <About />,
  services: <ServicesPreview />,
  whyus: <WhyUs />,
  bridal: <Bridal />,
  gallery: <Gallery />,
  academy: <AcademyPreview />,
  team: <Team />,
  testimonials: <Testimonials />,
  cta: <BookCta />,
  faq: <Faq />,
  instagram: <InstagramStrip />,
  contact: <Contact />,
};

const DEFAULT_ORDER = Object.keys(MAP);
// Added sections go right after their anchor when an older saved list doesn't know them
const ANCHORS: Record<string, string> = {
  stats: "hero",
  whyus: "services",
  cta: "testimonials",
  instagram: "faq",
};
const CORE = ["gallery", "testimonials", "contact"];

function resolveOrder(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw.map(rec) : [];
  const seen = new Set<string>();
  const order: string[] = [];
  for (const s of list) {
    const key = typeof s.key === "string" ? s.key : "";
    if (!(key in MAP) || seen.has(key)) continue;
    seen.add(key);
    if (s.visible !== false || CORE.includes(key)) order.push(key);
  }
  for (const key of DEFAULT_ORDER) {
    if (seen.has(key)) continue;
    const anchor = ANCHORS[key];
    const at = anchor ? order.indexOf(anchor) : -1;
    if (at >= 0) order.splice(at + 1, 0, key);
    else order.push(key);
  }
  return order;
}

export default function HomeSections() {
  const { data, themeId } = useSite();
  const { bands } = layoutFor(themeId);
  const order = resolveOrder(rec(data.settings.sections).list);
  return (
    <>
      {order.map((key, i) => (
        <div key={key} className={cn(bands && key !== "hero" && i % 2 === 0 && "bg-secondary/40")}>
          {MAP[key]}
        </div>
      ))}
    </>
  );
}
