import Section from "@/components/site/Section.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { str } from "@/lib/data.ts";

const POINTS = [
  "We collect your name, phone number and appointment details only to arrange your visit or course enquiry.",
  "We do not sell or share your information with third parties.",
  "You can ask us to delete your details at any time by calling or messaging us.",
];

export default function PrivacyPage() {
  const { t, site } = useSite();
  return (
    <Section title={t("privacy")} className="max-w-2xl">
      <div className="grid gap-4 text-muted-foreground">
        {POINTS.map((p) => <p key={p}>{p}</p>)}
        <p>{str(site.name)}, {str(site.phone1)}</p>
      </div>
    </Section>
  );
}
