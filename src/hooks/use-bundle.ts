import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchBundle } from "@/lib/api/content.ts";
import type { Bundle } from "@/lib/data.ts";

// Public site content; also read by the admin settings pages
export function useBundle(): UseQueryResult<Bundle> {
  return useQuery({ queryKey: ["bundle"], queryFn: fetchBundle, staleTime: 30_000 });
}
