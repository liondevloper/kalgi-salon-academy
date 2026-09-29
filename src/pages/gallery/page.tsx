import Section from "@/components/site/Section.tsx";
import { GalleryGrid } from "@/components/site/sections/Gallery.tsx";
import { useSite } from "@/lib/site-context.tsx";

export default function GalleryPage() {
  const { t } = useSite();
  return (
    <Section title={t("gallery")}>
      <GalleryGrid />
    </Section>
  );
}
