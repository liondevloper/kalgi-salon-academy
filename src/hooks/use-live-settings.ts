import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase.ts";

// Listens for settings changes (e.g. maintenance on/off) and refreshes site content instantly
export function useLiveSettings(): void {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("public-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, () => {
        void qc.invalidateQueries({ queryKey: ["bundle"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}
