import { Phone, MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { num, str, telLink, waLink } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { btnClass } from "../button-3d.ts";
import FloatingShapes from "../FloatingShapes.tsx";
import Img from "../Img.tsx";

export default function Hero() {
  const { data, site, t, L, tokens, preview } = useSite();
  const hero = data.settings.hero;
  const image = str(hero.image);
  const rating = num(site.rating, 4.8);
  const count = num(site.reviewCount, 1289);
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-background to-background">
      <FloatingShapes />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 @2xl:grid-cols-2 @2xl:px-8 @2xl:py-20">
        <motion.div
          initial={preview ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 * tokens.animSpeed }}
          className="space-y-5"
        >
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">{t("since")}</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1">
              <Star className="size-3 fill-current text-accent" />
              {rating}★ ({count.toLocaleString("en-IN")} {t("reviewsWord")})
            </span>
          </div>
          <h1 className={cn("text-balance text-4xl leading-[1.05] @md:text-5xl @4xl:text-6xl", HEADING)}>
            {L(hero.headline)}
          </h1>
          <p className="text-lg text-muted-foreground">{L(hero.sub)}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={waLink(str(site.whatsapp), t("whatsappGreeting"))} target="_blank" rel="noreferrer"
              onClick={preview ? (e) => e.preventDefault() : undefined} className={btnClass("primary")}>
              <MessageCircle className="size-4" /> {t("bookWhatsapp")}
            </a>
            <a href={telLink(str(site.phone1))} className={btnClass("secondary")}>
              <Phone className="size-4" /> {t("call")}
            </a>
          </div>
        </motion.div>
        <div className="[perspective:1000px]">
          <div className="aspect-[4/5] max-h-[440px] overflow-hidden rounded-[calc(var(--radius)+8px)] border border-border shadow-[var(--t-shadow)] [transform:rotateY(-8deg)_rotateX(3deg)]">
            <Img src={image} alt={str(site.name)} />
          </div>
        </div>
      </div>
    </section>
  );
}
