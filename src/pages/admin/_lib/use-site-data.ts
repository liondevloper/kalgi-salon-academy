import { useBundle } from "@/hooks/use-bundle.ts";
import { toSiteData, type SiteData } from "@/lib/data.ts";

// Admin pages edit the same merged settings the public site reads
export function useSiteData(): SiteData | undefined {
  const { data } = useBundle();
  return data ? toSiteData(data) : undefined;
}
