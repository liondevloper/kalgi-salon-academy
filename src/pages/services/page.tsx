import Section from "@/components/site/Section.tsx";
import { ServicesGrid } from "@/components/site/sections/ServicesPreview.tsx";
import { useSite } from "@/lib/site-context.tsx";

export default function ServicesPage() {
  const { t } = useSite();
  return (
    <Section title={t("ourServices")}>
      <ServicesGrid />
    </Section>
  );
}
