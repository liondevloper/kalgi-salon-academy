import Section from "@/components/site/Section.tsx";
import EnquiryForm from "@/components/site/EnquiryForm.tsx";
import { CourseGrid } from "@/components/site/sections/AcademyPreview.tsx";
import { useSite } from "@/lib/site-context.tsx";

export default function AcademyPage() {
  const { t } = useSite();
  return (
    <>
      <Section title={t("ourAcademy")}><CourseGrid /></Section>
      <Section title={t("enquireTitle")} className="max-w-2xl"><EnquiryForm /></Section>
    </>
  );
}
