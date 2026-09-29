import { motion, useReducedMotion } from "motion/react";

const SHAPES = [
  { cls: "left-[6%] top-[14%] size-16 rounded-full", dur: 6, dy: 14, from: "from-primary", to: "to-accent" },
  { cls: "right-[8%] top-[10%] size-24 rotate-12 rounded-[28%]", dur: 8, dy: 18, from: "from-accent", to: "to-secondary" },
  { cls: "bottom-[10%] left-[40%] size-10 rounded-full", dur: 5, dy: 10, from: "from-secondary", to: "to-primary" },
];

// Light floating decoration; disabled entirely for reduced motion
export default function FloatingShapes() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute bg-linear-to-br ${s.from} ${s.to} opacity-40 shadow-[0_18px_30px_-10px_rgba(0,0,0,.35),inset_0_2px_0_rgba(255,255,255,.4)] ${s.cls}`}
          animate={reduce ? undefined : { y: [0, -s.dy, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
