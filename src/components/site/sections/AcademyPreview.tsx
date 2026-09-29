import { GraduationCap } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import SiteLink from "../SiteLink.tsx";
import Tilt from "../Tilt.tsx";
import Section from "../Section.tsx";

export function CourseGrid({ compact }: { compact?: boolean }) {
  const { data, L, t } = useSite();
  return (
    <div className="grid gap-5 @2xl:grid-cols-2 [perspective:1000px]">
      {(data.items.course ?? []).map((c) => (
        <Tilt key={c._id} className="flex flex-col gap-2 p-6">
          <GraduationCap className="size-7 text-primary" aria-hidden />
          <h3 className={cn("text-xl", HEADING)}>{L(c.data.name)}</h3>
          <p className="text-sm text-muted-foreground">{L(c.data.desc)}</p>
          {!compact && (str(c.data.duration) || str(c.data.fee)) && (
            <p className="text-sm font-semibold">
              {str(c.data.duration) && `${t("duration")}: ${str(c.data.duration)}  `}
              {str(c.data.fee) && `${t("fee")}: ${str(c.data.fee)}`}
            </p>
          )}
        </Tilt>
      ))}
    </div>
  );
}

export default function AcademyPreview() {
  const { t } = useSite();
  return (
    <Section
      id="academy"
      title={t("ourAcademy")}
      action={<SiteLink to="/academy" className={btnClass("ghost", "px-3 py-2")}>{t("viewAll")}</SiteLink>}
    >
      <CourseGrid compact />
    </Section>
  );
}
