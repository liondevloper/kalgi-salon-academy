import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context.tsx";
import { rec } from "@/lib/data.ts";
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

const MAP: Record<string, ReactNode> = {
  hero: <Hero />,
  offers: <OffersBanner />,
  about: <About />,
  services: <ServicesPreview />,
  bridal: <Bridal />,
  gallery: <Gallery />,
  academy: <AcademyPreview />,
  team: <Team />,
  testimonials: <Testimonials />,
  faq: <Faq />,
  contact: <Contact />,
};

const DEFAULT_ORDER = Object.keys(MAP);

// Order comes from the admin Sections Manager. Any section missing from the saved list
// (old or partial saves) is appended so the home page never loses gallery, reviews or the map.
function resolveOrder(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw.map(rec) : [];
  const seen = new Set<string>();
  const hidden = new Set<string>();
  const order: string[] = [];
  for (const s of list) {
    const key = typeof s.key === "string" ? s.key : "";
    if (!(key in MAP) || seen.has(key)) continue;
    seen.add(key);
    if (s.visible === false) hidden.add(key);
    else order.push(key);
  }
  for (const key of DEFAULT_ORDER) if (!seen.has(key)) order.push(key);
  // Gallery, testimonials and contact/map are core to the home page
  for (const key of ["gallery", "testimonials", "contact"]) {
    if (hidden.has(key) && !order.includes(key)) order.push(key);
  }
  return order;
}

export default function HomeSections() {
  const { data } = useSite();
  const order = resolveOrder(rec(data.settings.sections).list);
  return (
    <>
      {order.map((key) => (
        <div key={key}>{MAP[key]}</div>
      ))}
    </>
  );
}
