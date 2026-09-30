import { Phone, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "@/lib/site-context.tsx";
import { HEADING } from "@/lib/themes.ts";
import { rec, str, telLink, waLink } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";

// Shown to visitors instead of the site while the admin has maintenance mode on
export default function MaintenancePage() {
  const { site, data, L, t } = useSite();
  const m = rec(data.settings.maintenance);
  const title = L(m.title) || t("maintenanceTitle");
  const body = L(m.message) || t("maintenanceBody");
  const logo = str(site.logo);
  const phone = str(site.phone1);
  const whatsapp = str(site.whatsapp);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-center text-foreground [font-family:var(--t-body)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex max-w-md flex-col items-center gap-5"
      >
        <span className="grid size-24 place-items-center overflow-hidden rounded-full border border-border bg-white">
          {logo ? (
            <img src={logo} alt="" className="size-full scale-[2.1] object-cover" />
          ) : (
            <span className="grid size-full place-items-center bg-primary text-4xl font-bold text-primary-foreground">K</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Wrench className="size-3.5" aria-hidden />
          {t("maintenanceBadge")}
        </span>
        <h1 className={cn("text-3xl text-balance @2xl:text-4xl", HEADING)}>{title}</h1>
        <p className="text-muted-foreground">{body}</p>
        <p className="text-sm font-semibold">{str(site.name)}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {whatsapp && (
            <a
              href={waLink(whatsapp, t("whatsappGreeting"))}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("bookWhatsapp")}
            </a>
          )}
          {phone && (
            <a
              href={telLink(phone)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="size-4" aria-hidden />
              {t("call")}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
