import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils.ts";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";

type Props = {
  id?: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

// Only a slide-in, never opacity 0: if the scroll observer misfires the content must still be visible
export default function Section({ id, title, action, children, className }: Props) {
  const { preview, tokens } = useSite();
  return (
    <motion.section
      id={id}
      initial={preview ? false : { y: 18 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 * tokens.animSpeed, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-6xl px-4 py-10 @2xl:px-8 @2xl:py-14", className)}
    >
      {(title || action) && (
        <div className="mb-6 flex items-end justify-between gap-3">
          {title && (
            <h2 className={cn("text-balance text-3xl leading-tight @2xl:text-4xl", HEADING)}>
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}
