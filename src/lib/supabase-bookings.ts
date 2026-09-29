import { supabase } from "./supabase.ts";

export type NewAppointment = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
};
export type NewEnquiry = { name: string; phone: string; course?: string; message?: string };

// RLS allows anonymous inserts only; nothing can be read back by visitors
export async function createAppointment(v: NewAppointment, isDemo: boolean): Promise<void> {
  const { error } = await supabase.from("appointments").insert({ ...v, is_demo: isDemo });
  if (error) throw error;
}

export async function createEnquiry(v: NewEnquiry, isDemo: boolean): Promise<void> {
  const { error } = await supabase.from("enquiries").insert({ ...v, is_demo: isDemo });
  if (error) throw error;
}
