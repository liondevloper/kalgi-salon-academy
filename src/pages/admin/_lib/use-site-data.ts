import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toSiteData, type SiteData } from "@/lib/data.ts";

// Admin pages edit the same merged settings the public site reads
export function useSiteData(): SiteData | undefined {
  const bundle = useQuery(api.content.bundle, {});
  return bundle ? toSiteData(bundle) : undefined;
}
