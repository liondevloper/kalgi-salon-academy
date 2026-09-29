import { useQueryClient } from "@tanstack/react-query";
import { withToast } from "./fields.ts";

// Re-fetch admin lists and the public site content after any change
export function useRefresh(): () => Promise<unknown> {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin"] }),
      qc.invalidateQueries({ queryKey: ["bundle"] }),
    ]);
}

// Runs a change, shows a toast, then refreshes the data
export function useAct(): (run: () => Promise<unknown>, ok?: string) => Promise<boolean> {
  const refresh = useRefresh();
  return async (run, ok = "Saved") => {
    const done = await withToast(run, ok);
    if (done) await refresh();
    return done;
  };
}
