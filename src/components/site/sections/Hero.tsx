import { Phone, MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { layoutFor } from "@/lib/theme-layouts.ts";
import { num, str, telLink, waLink } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import FloatingShapes from "../FloatingShapes.tsx";
import Img from "../Img.tsx";

function HeroText({ center, onImage }: { center?: boolean; onImage?: boolean }) {
  const { data, site, t, L, tokens, preview } = useSite();
  const hero = data.settings.hero;
  const rating = num(site.rating, 4.8);
  const count = num(site.reviewCount, 1289);
  return (
    <motion.div
      initial={preview ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 * tokens.animSpeed }}
      className={cn("space-y-5", center && "mx-auto max-w-3xl text-center", onImage && "text-white")}
    >
      <div className={cn("flex flex-wrap gap-2 text-xs font-semibold", center && "justify-center")}>
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">{t("since")}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-card-foreground">
          <Star className="size-3 fill-current text-accent" />
          {rating}★ ({count.toLocaleString("en-IN")} {t("reviewsWord")})
        </span>
      </div>
      <h1 className={cn("text-balance text-4xl leading-[1.05] @md:text-5xl @4xl:text-6xl", onImage && "@4xl:text-7xl uppercase", HEADING)}>
        {L(hero.headline)}
      </h1>
      <p className={cn("text-lg", onImage ? "text-white/85" : "text-muted-foreground")}>{L(hero.sub)}</p>
      <div className={cn("flex flex-wrap gap-3 pt-2", center && "justify-center")}>
        <a href={waLink(str(site.whatsapp), t("whatsappGreeting"))} target="_blank" rel="noreferrer"
          onClick={preview ? (e) => e.preventDefault() : undefined} className={btnClass("primary")}>
          <MessageCircle className="size-4" /> {t("bookWhatsapp")}
        </a>
        <a href={telLink(str(site.phone1))} className={btnClass("secondary")}>
          <Phone className="size-4" /> {t("call")}
        </a>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const { data, site, themeId } = useSite();
  const image = str(data.settings.hero.image);
  const layout = layoutFor(themeId).hero;
  const name = str(site.name);

  if (layout === "fullbleed" || layout === "centered") {
    return (
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10"><Img src={image} alt={name} /></div>
        <div className={cn("absolute inset-0 -z-10", layout === "fullbleed" ? "bg-black/65" : "bg-linear-to-b from-black/60 via-black/45 to-black/70")} />
        <div className={cn("mx-auto max-w-6xl px-4 py-24 @2xl:px-8 @2xl:py-36")}>
          <HeroText center={layout === "centered"} onImage />
        </div>
      </section>
    );
  }

  if (layout === "stacked") {
    return (
      <section className="relative overflow-hidden bg-linear-to-b from-secondary to-background">
        <FloatingShapes />
        <div className="relative mx-auto max-w-6xl space-y-10 px-4 py-14 @2xl:px-8 @2xl:py-20">
          <HeroText center />
          <div className="aspect-[16/9] overflow-hidden rounded-[calc(var(--radius)+12px)] border border-border shadow-[var(--t-shadow)]">
            <Img src={image} alt={name} />
          </div>
        </div>
      </section>
    );
  }

  const reverse = layout === "split-reverse";
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-background to-background">
      <FloatingShapes />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 @2xl:grid-cols-2 @2xl:px-8 @2xl:py-20">
        <div className={cn(reverse && "@2xl:order-2")}><HeroText /></div>
        <div className="[perspective:1000px]">
          <div className={cn(
            "aspect-[4/5] max-h-[440px] overflow-hidden border border-border shadow-[var(--t-shadow)]",
            reverse ? "rounded-[999px_999px_var(--radius)_var(--radius)] [transform:rotateY(8deg)]" : "rounded-[calc(var(--radius)+8px)] [transform:rotateY(-8deg)_rotateX(3deg)]",
          )}>
            <Img src={image} alt={name} />
          </div>
        </div>
      </div>
    </section>
  );
}
