import { useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SiteProvider } from "@/lib/site-context.tsx";
import { isLocale, saveLocale, savedLocale, type Locale } from "@/lib/i18n.ts";
import { seedSiteData, str, toSiteData, type SiteData } from "@/lib/data.ts";
import { resolveTokens, themeStyle } from "@/lib/themes.ts";
import { useBundle } from "@/hooks/use-bundle.ts";
import SiteShell from "@/components/site/SiteShell.tsx";
import Footer from "@/components/site/Footer.tsx";
import HomePage from "./home/page.tsx";
import BookPage from "./book/page.tsx";
import ServicesPage from "./services/page.tsx";
import AcademyPage from "./academy/page.tsx";
import OffersPage from "./offers/page.tsx";
import GalleryPage from "./gallery/page.tsx";
import ContactPage from "./contact/page.tsx";
import PrivacyPage from "./privacy-policy/page.tsx";
import NotFound from "./NotFound.tsx";

const ENV_DEMO = import.meta.env.VITE_DEMO_MODE !== "false";

// Loads content once and applies theme + locale. An empty or unreachable database shows the built-in demo content.
function LocaleSite({ children }: { children: (data: SiteData, path: string) => ReactNode }) {
  const { locale } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: bundle, isPending } = useBundle();

  const loc: Locale = isLocale(locale) ? locale : "en";
  useEffect(() => {
    saveLocale(loc);
    document.documentElement.lang = loc;
  }, [loc]);

  const siteSetting = bundle?.settings.site as { demoMode?: boolean } | undefined;
  const demoNow = ENV_DEMO && siteSetting !== undefined ? siteSetting.demoMode !== false : ENV_DEMO;
  // Demo on: noindex. Demo off: allow indexing.
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = demoNow ? "noindex, nofollow" : "index, follow";
  }, [demoNow]);

  if (isPending) {
    return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  }
  const data = bundle?.seeded ? toSiteData(bundle) : seedSiteData();
  const themeRow = data.settings.theme;
  const { id, tokens } = resolveTokens(themeRow.active, themeRow.overrides);
  const demo = ENV_DEMO && data.settings.site.demoMode !== false;
  const rest = pathname.replace(/^\/(en|hi|gu)/, "") || "/";
  const setLocale = (l: Locale) => navigate(`/${l}${rest === "/" ? "" : rest}`);
  const title = str(data.settings.site.name);

  return (
    <SiteProvider data={data} locale={loc} setLocale={setLocale} tokens={tokens} themeId={id} demo={demo} activePath={rest}>
      <div style={themeStyle(tokens)} className="contents" data-theme={id} data-title={title}>
        <SiteShell>
          {children(data, rest)}
          <Footer />
        </SiteShell>
      </div>
    </SiteProvider>
  );
}

function Pages() {
  return (
    <LocaleSite>
      {() => (
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="academy" element={<AcademyPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </LocaleSite>
  );
}

export function RootRedirect() {
  return <Navigate to={`/${savedLocale()}`} replace />;
}

export default Pages;
