import { supabase } from "@/lib/supabase.ts";
import { check } from "./util.ts";

export type AppointmentInput = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
};

export type EnquiryInput = {
  name: string;
  phone: string;
  course?: string;
  message?: string;
};

// Anonymous visitors may only insert; reading is limited to admins by row level security.
export async function createAppointment(v: AppointmentInput): Promise<void> {
  const { error } = await supabase.from("appointments").insert({
    name: v.name.trim(),
    phone: v.phone,
    service: v.service,
    date: v.date,
    time: v.time,
    message: v.message?.trim() || null,
  });
  check(error);
}

export async function createEnquiry(v: EnquiryInput): Promise<void> {
  const { error } = await supabase.from("enquiries").insert({
    name: v.name.trim(),
    phone: v.phone,
    course: v.course || null,
    message: v.message?.trim() || null,
  });
  check(error);
}
