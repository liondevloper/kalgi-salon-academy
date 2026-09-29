import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { num, str } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import Img from "../Img.tsx";
import Section from "../Section.tsx";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  const shown = Number.isInteger(value) ? Math.round(n).toLocaleString("en-IN") : n.toFixed(1);
  return <span ref={ref}>{shown}{suffix}</span>;
}

export default function About() {
  const { data, L } = useSite();
  const a = data.settings.about;
  const stats = [1, 2, 3, 4].map((i) => ({
    value: num(a[`stat${i}Value`]),
    suffix: str(a[`stat${i}Suffix`]),
    label: L(a[`stat${i}Label`]),
  }));
  return (
    <Section id="about" title={L(a.title)}>
      <div className="grid items-center gap-8 @2xl:grid-cols-2">
        <p className={cn("text-balance text-xl leading-relaxed text-muted-foreground @2xl:text-2xl", HEADING)}>
          {L(a.body)}
        </p>
        {str(a.image) && (
          <div className="aspect-video overflow-hidden rounded-[var(--radius)]"><Img src={str(a.image)} /></div>
        )}
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-4 @2xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-[var(--radius)] border border-border bg-card p-4 text-center shadow-[var(--t-shadow)]">
            <dd className={cn("text-3xl font-bold text-primary", HEADING)}><Counter value={s.value} suffix={s.suffix} /></dd>
            <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
