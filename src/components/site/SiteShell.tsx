import type { ReactNode } from "react";
import { CalendarCheck, Check, ChevronDown, GraduationCap, Home, Languages, Scissors, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING, themeStyle } from "@/lib/themes.ts";
import { LOCALES, type Locale } from "@/lib/i18n.ts";
import { str, waLink } from "@/lib/data.ts";
import SiteLink from "./SiteLink.tsx";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

const NAV = [
  { key: "home", path: "/", icon: Home },
  { key: "book", path: "/book", icon: CalendarCheck },
  { key: "services", path: "/services", icon: Scissors },
  { key: "academy", path: "/academy", icon: GraduationCap },
] as const;

// Official WhatsApp glyph (Simple Icons, 24x24). lucide has no brand icons.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Single icon button that opens a small language list, so the header stays on one line
function LanguagePicker() {
  const { locale, setLocale } = useSite();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];

  const choose = (id: Locale) => {
    setLocale(id);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="flex cursor-pointer items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground"
      >
        <Languages className="size-4" aria-hidden />
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <>
          {/* Invisible backdrop closes the menu when tapping anywhere else */}
          <button
            type="button"
            aria-label="Close language menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <ul
            role="listbox"
            aria-label="Language"
            className="absolute right-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-[var(--radius)] border border-border bg-card p-1 shadow-[var(--t-shadow)]"
          >
            {LOCALES.map((l) => {
              const active = locale === l.id;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(l.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-[calc(var(--radius)-4px)] px-3 py-2 text-sm font-semibold",
                      active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                    )}
                  >
                    {l.label}
                    {active && <Check className="size-4" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function TopBar() {
  const { site } = useSite();
  const logo = str(site.logo);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-2 backdrop-blur @2xl:px-8">
      <SiteLink to="/" className="flex min-w-0 items-center gap-2.5">
        {/* Round frame; the logo is zoomed so the mark fills it and extra margins hide behind the circle */}
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-white @2xl:size-14">
          {logo ? (
            <img src={logo} alt="" className="size-full scale-[1.35] object-cover" />
          ) : (
            <span className="grid size-full place-items-center bg-primary text-xl font-bold text-primary-foreground">
              K
            </span>
          )}
        </span>
        <span className={cn("truncate text-lg font-semibold @2xl:text-xl", HEADING)}>{str(site.name)}</span>
      </SiteLink>
      <LanguagePicker />
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

// No circle and no shadow behind the logo: a shadow reads as a blurry line beside it.
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
        "z-40 cursor-pointer text-[#25D366] transition-transform hover:-translate-y-0.5 active:translate-y-[2px]",
        preview ? "absolute bottom-24 right-3" : "fixed bottom-28 right-4",
      )}
    >
      <WhatsAppIcon className="size-10" />
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
      <ThemeSwitcher />
      <WhatsAppFab />
      <BottomNav />
    </div>
  );
}
