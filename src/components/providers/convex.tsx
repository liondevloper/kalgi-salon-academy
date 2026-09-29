import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase/client.ts";

const SupabaseContext = createContext(supabase);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  return useContext(SupabaseContext);
}

/** Temporary compatibility export while feature modules are migrated. */
export const ConvexProvider = SupabaseProvider;
