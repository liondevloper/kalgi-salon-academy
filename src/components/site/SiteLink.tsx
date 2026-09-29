import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context.tsx";

type Props = { to: string; className?: string; children: ReactNode; onClick?: () => void };

// All internal links go through here so previews never navigate away
export default function SiteLink({ to, className, children, onClick }: Props) {
  const { preview, onPreviewGo, locale } = useSite();
  if (preview) {
    return (
      <a
        href="#"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onPreviewGo?.(to);
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={`/${locale}${to === "/" ? "" : to}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
