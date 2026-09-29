import { supabase } from "@/lib/supabase.ts";
import { num, rec, str, type Rec } from "@/lib/data.ts";
import { asRows, check } from "./util.ts";

const BUCKET = "media";

// ---------- access ----------
export type AdminStatus = { isAdmin: boolean; canClaim: boolean };

export async function getAdminStatus(userId: string): Promise<AdminStatus> {
  // Row level security returns rows here only when the caller is an admin
  const [adminRes, claimRes] = await Promise.all([
    supabase.from("admins").select("user_id").eq("user_id", userId),
    supabase.rpc("can_claim_owner"),
  ]);
  check(adminRes.error);
  check(claimRes.error);
  const canClaim: unknown = claimRes.data;
  return { isAdmin: asRows(adminRes.data).length > 0, canClaim: canClaim === true };
}

export async function claimOwner(): Promise<void> {
  const { data, error } = await supabase.rpc("claim_owner");
  check(error);
  const ok: unknown = data;
  if (ok !== true) throw new Error("An owner already exists");
}

export type AdminUser = { userId: string; email: string };

export async function listAdmins(): Promise<AdminUser[]> {
  const { data, error } = await supabase.rpc("list_admins");
  check(error);
  return asRows(data).map((r) => ({ userId: str(r.user_id), email: str(r.email) }));
}

export async function addAdmin(email: string): Promise<void> {
  const { error } = await supabase.rpc("add_admin", { p_email: email.trim() });
  check(error);
}

export async function removeAdmin(userId: string): Promise<void> {
  const { error } = await supabase.rpc("remove_admin", { p_user: userId });
  check(error);
}

// ---------- content items ----------
export type AdminItem = { id: string; order: number; visible: boolean; data: Rec };

const toItem = (r: Rec): AdminItem => ({
  id: str(r.id),
  order: num(r.order),
  visible: r.visible !== false,
  data: rec(r.data),
});

export async function listItems(kind: string): Promise<AdminItem[]> {
  const { data, error } = await supabase
    .from("items")
    .select("id,order,visible,data")
    .eq("kind", kind)
    .order("order", { ascending: true })
    .limit(500);
  check(error);
  return asRows(data).map(toItem);
}

export async function upsertItem(input: {
  id?: string;
  kind: string;
  data: Rec;
  visible?: boolean;
}): Promise<void> {
  if (input.id) {
    const patch: Rec = { data: input.data };
    if (input.visible !== undefined) patch.visible = input.visible;
    const { error } = await supabase.from("items").update(patch).eq("id", input.id);
    check(error);
    return;
  }
  const last = await supabase
    .from("items")
    .select("order")
    .eq("kind", input.kind)
    .order("order", { ascending: false })
    .limit(1);
  check(last.error);
  const next = num(asRows(last.data).at(0)?.order) + 1;
  const { error } = await supabase.from("items").insert({
    kind: input.kind,
    order: next,
    visible: input.visible ?? true,
    data: input.data,
  });
  check(error);
}

export async function setItemVisible(id: string, visible: boolean): Promise<void> {
  const { error } = await supabase.from("items").update({ visible }).eq("id", id);
  check(error);
}

export async function removeItem(id: string): Promise<void> {
  const { error } = await supabase.from("items").delete().eq("id", id);
  check(error);
}

// Swap order with the neighbour above or below
export async function moveItem(id: string, direction: "up" | "down"): Promise<void> {
  const cur = await supabase.from("items").select("id,kind,order").eq("id", id).single();
  check(cur.error);
  const item = rec(cur.data);
  const up = direction === "up";
  const base = supabase.from("items").select("id,order").eq("kind", str(item.kind));
  const found = await (up ? base.lt("order", num(item.order)) : base.gt("order", num(item.order)))
    .order("order", { ascending: !up })
    .limit(1);
  check(found.error);
  const neighbour = asRows(found.data).at(0);
  if (!neighbour) return;
  const a = await supabase.from("items").update({ order: num(neighbour.order) }).eq("id", id);
  check(a.error);
  const b = await supabase.from("items").update({ order: num(item.order) }).eq("id", str(neighbour.id));
  check(b.error);
}

// ---------- settings ----------
export async function setSetting(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  check(error);
}

// ---------- bookings and enquiries ----------
export const STATUSES = ["New", "Confirmed", "Completed", "Cancelled"] as const;
export type AppointmentStatus = (typeof STATUSES)[number];
export const isStatus = (x: string): x is AppointmentStatus =>
  (STATUSES as readonly string[]).includes(x);

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: AppointmentStatus;
  notes: string;
  isDemo: boolean;
  createdAt: string;
};

const APPOINTMENT_COLS = "id,name,phone,service,date,time,message,status,notes,is_demo,created_at";

const toAppointment = (r: Rec): Appointment => ({
  id: str(r.id),
  name: str(r.name),
  phone: str(r.phone),
  service: str(r.service),
  date: str(r.date),
  time: str(r.time),
  message: str(r.message),
  status: STATUSES.find((s) => s === r.status) ?? "New",
  notes: str(r.notes),
  isDemo: r.is_demo === true,
  createdAt: str(r.created_at),
});

export async function listAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_COLS)
    .order("created_at", { ascending: false })
    .limit(500);
  check(error);
  return asRows(data).map(toAppointment);
}

export async function updateAppointment(
  id: string,
  patch: { status?: AppointmentStatus; notes?: string },
): Promise<void> {
  const { error } = await supabase.from("appointments").update(patch).eq("id", id);
  check(error);
}

export async function removeAppointment(id: string): Promise<void> {
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  check(error);
}

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  course: string;
  message: string;
  isDemo: boolean;
  createdAt: string;
};

export async function listEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("id,name,phone,course,message,is_demo,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  check(error);
  return asRows(data).map((r) => ({
    id: str(r.id),
    name: str(r.name),
    phone: str(r.phone),
    course: str(r.course),
    message: str(r.message),
    isDemo: r.is_demo === true,
    createdAt: str(r.created_at),
  }));
}

export async function removeEnquiry(id: string): Promise<void> {
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  check(error);
}

// ---------- dashboard ----------
export type Stats = {
  newBookings: number;
  totalBookings: number;
  enquiries: number;
  services: number;
  latest: Appointment[];
};

export async function fetchStats(): Promise<Stats> {
  const count = { count: "exact", head: true } as const;
  const [fresh, all, enquiries, services, latest] = await Promise.all([
    supabase.from("appointments").select("id", count).eq("status", "New"),
    supabase.from("appointments").select("id", count),
    supabase.from("enquiries").select("id", count),
    supabase.from("items").select("id", count).eq("kind", "service"),
    supabase
      .from("appointments")
      .select(APPOINTMENT_COLS)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  for (const r of [fresh, all, enquiries, services, latest]) check(r.error);
  return {
    newBookings: fresh.count ?? 0,
    totalBookings: all.count ?? 0,
    enquiries: enquiries.count ?? 0,
    services: services.count ?? 0,
    latest: asRows(latest.data).map(toAppointment),
  };
}

// ---------- media ----------
export type MediaItem = { id: string; storagePath: string; url: string; name: string; alt: string };

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from("media")
    .select("id,storage_path,url,name,alt")
    .order("created_at", { ascending: false })
    .limit(300);
  check(error);
  return asRows(data).map((r) => ({
    id: str(r.id),
    storagePath: str(r.storage_path),
    url: str(r.url),
    name: str(r.name),
    alt: str(r.alt),
  }));
}

// Uploads to the public "media" bucket and records it; returns the public link
export async function uploadMedia(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  check(up.error);
  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const { error } = await supabase
    .from("media")
    .insert({ storage_path: path, url, name: file.name, alt: "" });
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error.message);
  }
  return url;
}

export async function updateMediaAlt(id: string, alt: string): Promise<void> {
  const { error } = await supabase.from("media").update({ alt }).eq("id", id);
  check(error);
}

export async function removeMedia(item: MediaItem): Promise<void> {
  const rm = await supabase.storage.from(BUCKET).remove([item.storagePath]);
  check(rm.error);
  const { error } = await supabase.from("media").delete().eq("id", item.id);
  check(error);
}
