import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  // needsConfirmation is true when Supabase requires the email to be confirmed first
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthValue | null>(null);
