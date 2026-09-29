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

// Section order and visibility come from the admin Sections Manager
export default function HomeSections() {
  const { data } = useSite();
  const raw = data.settings.sections.list;
  const list = Array.isArray(raw) ? raw.map(rec) : [];
  return (
    <>
      {list
        .filter((s) => s.visible !== false && typeof s.key === "string" && s.key in MAP)
        .map((s) => (
          <div key={String(s.key)}>{MAP[String(s.key)]}</div>
        ))}
    </>
  );
}
