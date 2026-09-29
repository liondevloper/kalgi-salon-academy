import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import Img from "../Img.tsx";
import Tilt from "../Tilt.tsx";
import Section from "../Section.tsx";

export default function Team() {
  const { data, L, t } = useSite();
  const team = data.items.team ?? [];
  if (team.length === 0) return null;
  return (
    <Section id="team" title={t("team")}>
      <div className="grid grid-cols-2 gap-4 @2xl:grid-cols-3 [perspective:1000px]">
        {team.map((m) => (
          <Tilt key={m._id} className="overflow-hidden">
            <div className="aspect-[4/5]"><Img src={str(m.data.photo)} alt={L(m.data.name)} /></div>
            <div className="p-4">
              <p className={cn("text-lg", HEADING)}>{L(m.data.name)}</p>
              <p className="text-sm text-muted-foreground">{L(m.data.role)}</p>
              {L(m.data.bio) && <p className="mt-1 text-xs text-muted-foreground">{L(m.data.bio)}</p>}
            </div>
          </Tilt>
        ))}
      </div>
    </Section>
  );
}
