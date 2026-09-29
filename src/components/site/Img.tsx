import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type Props = { src?: string; alt?: string; className?: string };

// Placeholder gradient until a real photo is uploaded from admin
export default function Img({ src, alt = "", className }: Props) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div
      role="img"
      aria-label={alt || "Placeholder"}
      className={cn(
        "flex h-full w-full items-center justify-center bg-linear-to-br from-primary/70 to-accent/70 text-primary-foreground",
        className,
      )}
    >
      <ImageIcon className="size-8 opacity-60" />
    </div>
  );
}
