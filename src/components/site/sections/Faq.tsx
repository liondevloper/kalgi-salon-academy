import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { useSite } from "@/lib/site-context.tsx";
import Section from "../Section.tsx";

export default function Faq() {
  const { data, L, t } = useSite();
  const faqs = data.items.faq ?? [];
  if (faqs.length === 0) return null;
  return (
    <Section id="faq" title={t("faq")}>
      <Accordion type="single" collapsible className="rounded-[var(--radius)] border border-border bg-card px-4">
        {faqs.map((f) => (
          <AccordionItem key={f._id} value={f._id}>
            <AccordionTrigger className="cursor-pointer text-left text-base">{L(f.data.q)}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{L(f.data.a)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
