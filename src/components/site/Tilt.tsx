import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils.ts";
import { useSite } from "@/lib/site-context.tsx";

// CSS 3D tilt card: rotateX/Y follow the mouse, layered shadow gives depth
export default function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const { tokens } = useSite();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const max = tokens.tilt;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={reduce ? undefined : move}
      onPointerLeave={reduce ? undefined : leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn(
        "rounded-[var(--radius)] border border-border bg-card text-card-foreground shadow-[var(--t-shadow)] [backdrop-filter:blur(var(--t-blur))]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
