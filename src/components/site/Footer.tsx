import { AtSign } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { str } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import SiteLink from "./SiteLink.tsx";

export default function Footer() {
  const { site, L, t } = useSite();
  return (
    <footer className="border-t border-border bg-secondary/60 px-4 py-10 text-center @2xl:px-8">
      <p className={cn("text-2xl", HEADING)}>{str(site.name)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{L(site.footer)}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        {str(site.instagram) && (
          <a href={str(site.instagram)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
            <AtSign className="size-4" /> Instagram
          </a>
        )}
        <SiteLink to="/privacy-policy" className="underline">{t("privacy")}</SiteLink>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()} {str(site.name)}</p>
    </footer>
  );
}
