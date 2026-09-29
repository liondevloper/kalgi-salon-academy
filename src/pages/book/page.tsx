import Section from "@/components/site/Section.tsx";
import BookingForm from "@/components/site/BookingForm.tsx";
import { useSite } from "@/lib/site-context.tsx";

export default function BookPage() {
  const { t } = useSite();
  return (
    <Section title={t("bookTitle")} className="max-w-2xl">
      <BookingForm />
    </Section>
  );
}
