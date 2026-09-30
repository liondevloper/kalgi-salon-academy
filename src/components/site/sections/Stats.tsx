import { Award, Heart, Star, Users } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { layoutFor } from "@/lib/theme-layouts.ts";
import { num } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";

export default function Stats() {
  const { site, L, themeId } = useSite();
  const cards = layoutFor(themeId).cards;
  const years = new Date().getFullYear() - 1994;
  const stats = [
    { icon: Award, value: `${years}+`, label: { en: "Years of trust", hi: "साल का भरोसा", gu: "વર્ષનો વિશ્વાસ" } },
    { icon: Users, value: "25,000+", label: { en: "Happy clients", hi: "खुश ग्राहक", gu: "ખુશ ગ્રાહકો" } },
    { icon: Star, value: `${num(site.rating, 4.8)}★`, label: { en: "Google rating", hi: "गूगल रेटिंग", gu: "ગૂગલ રેટિંગ" } },
    { icon: Heart, value: "1,500+", label: { en: "Brides styled", hi: "दुल्हनें सजाईं", gu: "દુલ્હનો સજાવી" } },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 @2xl:px-8">
      <div className={cn(
        "grid grid-cols-2 gap-3 @2xl:grid-cols-4",
        cards === "list" && "divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-card @2xl:divide-x gap-0",
      )}>
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={value} className={cn(
            "flex flex-col items-center gap-1 p-5 text-center",
            cards === "grid" && "rounded-[var(--radius)] border border-border bg-card shadow-[var(--t-shadow)]",
            cards === "bold" && "border-2 border-primary bg-card shadow-[var(--t-shadow)]",
          )}>
            <Icon className="size-6 text-primary" />
            <p className={cn("text-3xl", HEADING)}>{value}</p>
            <p className="text-sm text-muted-foreground">{L(label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
