import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { num, str, waLink } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import Img from "../Img.tsx";
import Section from "../Section.tsx";

export default function Testimonials() {
  const { data, site, L, t } = useSite();
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  const all = data.items.testimonial ?? [];
  const texts = all.filter((x) => str(x.data.type) !== "screenshot");
  const shots = all.filter((x) => str(x.data.type) === "screenshot");
  const cur = texts[i % Math.max(texts.length, 1)];
  const link = str(site.reviewLink) || waLink("", "");
  return (
    <Section id="testimonials" title={t("testimonials")}>
      {cur && (
        <div className="relative rounded-[var(--radius)] border border-border bg-card p-6 text-center shadow-[var(--t-shadow)] @2xl:p-10">
          <div className="mb-3 flex justify-center gap-0.5" aria-label={`${num(cur.data.rating, 5)} stars`}>
            {Array.from({ length: num(cur.data.rating, 5) }).map((_, k) => (
              <Star key={k} className="size-5 fill-current text-accent" />
            ))}
          </div>
          <p className={cn("text-balance text-xl @2xl:text-2xl", HEADING)}>“{L(cur.data.text)}”</p>
          <p className="mt-3 font-semibold text-primary">{str(cur.data.name)}</p>
          {texts.length > 1 && (
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" aria-label="Previous" onClick={() => setI((i - 1 + texts.length) % texts.length)} className={btnClass("secondary", "px-3 py-2")}><ChevronLeft className="size-4" /></button>
              <button type="button" aria-label="Next" onClick={() => setI((i + 1) % texts.length)} className={btnClass("secondary", "px-3 py-2")}><ChevronRight className="size-4" /></button>
            </div>
          )}
        </div>
      )}
      {shots.length > 0 && (
        <div className="mt-6 columns-2 gap-3 @2xl:columns-3">
          {shots.map((s) => (
            <button key={s._id} type="button" onClick={() => setZoom(str(s.data.image))} className="mb-3 block w-full cursor-pointer overflow-hidden rounded-[var(--radius)] border border-border">
              <div className="aspect-[3/4]"><Img src={str(s.data.image)} alt="Google review" /></div>
            </button>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <a href={link} target="_blank" rel="noreferrer" className={btnClass("primary")}>
          <Star className="size-4" /> {t("reviewUs")}
        </a>
      </div>
      <Dialog open={zoom !== null} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="max-w-lg p-2">
          <DialogTitle className="sr-only">Google review</DialogTitle>
          {zoom !== null && <Img src={zoom} alt="Google review" className="object-contain" />}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
