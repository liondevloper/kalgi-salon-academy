import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str, type Item } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import Img from "../Img.tsx";
import SiteLink from "../SiteLink.tsx";
import Section from "../Section.tsx";

function BeforeAfter({ item }: { item: Item }) {
  const { L } = useSite();
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] select-none overflow-hidden rounded-[var(--radius)] border border-border shadow-[var(--t-shadow)]">
      <Img src={str(item.data.after)} alt={L(item.data.alt)} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img src={str(item.data.image)} alt={L(item.data.alt)} className="grayscale-[40%]" />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
      <input
        type="range" min={0} max={100} value={pos} aria-label="Before and after"
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export function GalleryGrid({ limit }: { limit?: number }) {
  const { data, L, t } = useSite();
  const [open, setOpen] = useState<Item | null>(null);
  const all = data.items.gallery ?? [];
  const pairs = all.filter((g) => str(g.data.type) === "beforeafter");
  const photos = all.filter((g) => str(g.data.type) !== "beforeafter");
  const shown = limit ? photos.slice(0, limit) : photos;
  return (
    <>
      {pairs.length > 0 && (
        <div className="mb-8">
          <h3 className={cn("mb-3 text-xl", HEADING)}>{t("beforeAfter")}</h3>
          <div className="grid gap-4 @2xl:grid-cols-2">
            {pairs.slice(0, limit ? 1 : 6).map((p) => <BeforeAfter key={p._id} item={p} />)}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 [perspective:1000px]">
        {shown.map((g, i) => (
          <button
            key={g._id} type="button" onClick={() => setOpen(g)}
            className={cn(
              "cursor-pointer overflow-hidden rounded-[var(--radius)] border border-border shadow-[var(--t-shadow)] transition-transform hover:[transform:rotateY(-6deg)_scale(1.03)]",
              i % 3 === 0 ? "aspect-[3/4]" : "aspect-square",
            )}
          >
            <Img src={str(g.data.image)} alt={L(g.data.alt)} />
          </button>
        ))}
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{t("gallery")}</DialogTitle>
          <div className="aspect-[4/3] overflow-hidden rounded-md">
            {open && <Img src={str(open.data.image)} alt={L(open.data.alt)} className="object-contain" />}
          </div>
          <X className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Gallery() {
  const { t } = useSite();
  return (
    <Section
      id="gallery"
      title={t("gallery")}
      action={<SiteLink to="/gallery" className={btnClass("ghost", "px-3 py-2")}>{t("viewAll")}</SiteLink>}
    >
      <GalleryGrid limit={6} />
    </Section>
  );
}
