import type { ReactNode } from "react";
import { CalendarCheck, GraduationCap, Home, Scissors, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING, themeStyle } from "@/lib/themes.ts";
import { LOCALES, type Locale } from "@/lib/i18n.ts";
import { str, waLink } from "@/lib/data.ts";
import SiteLink from "./SiteLink.tsx";

const NAV = [
  { key: "home", path: "/", icon: Home },
  { key: "book", path: "/book", icon: CalendarCheck },
  { key: "services", path: "/services", icon: Scissors },
  { key: "academy", path: "/academy", icon: GraduationCap },
] as const;

function TopBar() {
  const { site, locale, setLocale } = useSite();
  const logo = str(site.logo);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur @2xl:px-8">
      <SiteLink to="/" className="flex min-w-0 items-center gap-2">
        {logo ? (
          <img src={logo} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            K
          </span>
        )}
        <span className={cn("truncate text-lg font-semibold", HEADING)}>{str(site.name)}</span>
      </SiteLink>
      <div role="group" aria-label="Language" className="flex shrink-0 rounded-full border border-border bg-card p-0.5">
        {LOCALES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id as Locale)}
            aria-pressed={locale === l.id}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold",
              locale === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function BottomNav() {
  const { t, activePath, preview } = useSite();
  return (
    <nav
      aria-label="Main"
      className={cn(
        "z-40 flex justify-center px-3 pb-3",
        preview ? "shrink-0 pt-2" : "pointer-events-none fixed inset-x-0 bottom-0",
      )}
    >
      <ul className="pointer-events-auto flex w-full max-w-md items-center justify-around rounded-[calc(var(--radius)+8px)] border border-border bg-card/95 p-1.5 shadow-[var(--t-shadow)] backdrop-blur">
        {NAV.map(({ key, path, icon: Icon }) => {
          const active = activePath === path;
          return (
            <li key={key} className="flex-1">
              <SiteLink
                to={path}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-[var(--radius)] px-2 py-2 text-[11px] font-semibold transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                <span>{t(key)}</span>
              </SiteLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function WhatsAppFab() {
  const { site, t, preview } = useSite();
  return (
    <a
      href={waLink(str(site.whatsapp), t("whatsappGreeting"))}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      onClick={preview ? (e) => e.preventDefault() : undefined}
      className={cn(
        "z-40 grid size-12 cursor-pointer place-items-center rounded-full bg-[#128c4a] text-white shadow-[0_8px_0_#0b5f32,0_14px_22px_rgba(0,0,0,.3)] transition-transform hover:-translate-y-0.5 active:translate-y-[3px]",
        preview ? "absolute bottom-24 right-3" : "fixed bottom-28 right-4",
      )}
    >
      <MessageCircle className="size-6" />
    </a>
  );
}

function DemoRibbon() {
  const { demo, t } = useSite();
  const [open, setOpen] = useState(true);
  if (!demo || !open) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
      {t("demoRibbon")}
      <button type="button" aria-label="Dismiss" onClick={() => setOpen(false)} className="cursor-pointer">
        <X className="size-3" />
      </button>
    </div>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const { tokens, preview } = useSite();
  return (
    <div
      style={themeStyle(tokens)}
      className={cn(
        "@container relative bg-background text-foreground [font-family:var(--t-body)]",
        preview ? "flex h-full flex-col overflow-hidden" : "min-h-screen pb-28",
      )}
    >
      <DemoRibbon />
      <div className={cn(preview ? "min-h-0 flex-1 overflow-y-auto" : "")}>
        <TopBar />
        <main>{children}</main>
      </div>
      <WhatsAppFab />
      <BottomNav />
    </div>
  );
}
