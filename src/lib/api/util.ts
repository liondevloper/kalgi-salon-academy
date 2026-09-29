import { rec, type Rec } from "@/lib/data.ts";

// Supabase rows arrive loosely typed; narrow them once here.
export const asRows = (data: unknown): Rec[] => (Array.isArray(data) ? data.map(rec) : []);

export function check(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}
