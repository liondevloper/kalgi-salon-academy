import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "./supabase.ts";
import { num, rec, str, toSiteData, type Rec, type SiteData } from "./data.ts";

// ---------- helpers ----------
type Failure = { message: string } | null;

function unwrap(res: { error: Failure }): void {
  if (res.error) throw new Error(res.error.message);
}
function unwrapList(res: { data: unknown[] | null; error: Failure }): Rec[] {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []).map(rec);
}

export function errorMessage(e: unknown, fallback = "Something went wrong"): string {
  return e instanceof Error && e.message ? e.message : fallback;
}

export async function withToast(run: () => Promise<unknown>, ok = "Saved"): Promise<boolean> {
  try {
    await run();
    toast.success(ok);
    return true;
  } catch (e) {
    toast.error(errorMessage(e));
    return false;
  }
}

// ---------- reactive loading (re-runs after any admin write) ----------
const listeners = new Set<() => void>();
export const refresh = (): void => listeners.forEach((l) => l());

// undefined = loading
export function useLoad<T>(load: () => Promise<T>, key: string): T | undefined {
  const [state, setState] = useState<{ key: string; value: T } | undefined>(undefined);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    listeners.add(bump);
    return () => {
      listeners.delete(bump);
    };
  }, []);
  useEffect(() => {
    let alive = true;
    load()
      .then((value) => alive && setState({ key, value }))
      .catch((e: unknown) => toast.error(errorMessage(e, "Could not load data")));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);
  return state?.key === key ? state.value : undefined;
}

// ---------- auth ----------
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

// Returns true when signed in straight away, false when email confirmation is needed
export async function signUp(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data.session !== null;
}

export const signOut = (): Promise<unknown> => supabase.auth.signOut();

export type Access = { isAdmin: boolean; canClaim: boolean };

export async function fetchAccess(userId: string): Promise<Access> {
  const rows = unwrapList(await supabase.from("admins").select("user_id").eq("user_id", userId));
  const claim = await supabase.rpc("can_claim_owner");
  return { isAdmin: rows.length > 0, canClaim: claim.data === true };
}

export async function claimOwner(): Promise<void> {
  const { data, error } = await supabase.rpc("claim_owner");
  if (error) throw new Error(error.message);
  if (data !== true) throw new Error("Owner is already set up");
  refresh();
}

export type AdminRow = { userId: string; email: string };

export async function listAdmins(): Promise<AdminRow[]> {
  return unwrapList(await supabase.rpc("list_admins")).map((r) => ({ userId: str(r.user_id), email: str(r.email) }));
}
export async function addAdmin(email: string): Promise<void> {
  unwrap(await supabase.rpc("add_admin", { p_email: email }));
  refresh();
}
export async function removeAdmin(userId: string): Promise<void> {
  unwrap(await supabase.rpc("remove_admin", { p_user: userId }));
  refresh();
}

// ---------- bookings & enquiries ----------
export const STATUSES = ["New", "Confirmed", "Completed", "Cancelled"] as const;
export type Status = (typeof STATUSES)[number];
export const isStatus = (x: string): x is Status => (STATUSES as readonly string[]).includes(x);

export type Appointment = {
  _id: string; name: string; phone: string; service: string; date: string; time: string;
  message: string; status: Status; notes: string; isDemo: boolean; createdAt: string;
};
export type Enquiry = {
  _id: string; name: string; phone: string; course: string; message: string; isDemo: boolean; createdAt: string;
};

function toAppointment(r: Rec): Appointment {
  const status = str(r.status);
  return {
    _id: str(r.id), name: str(r.name), phone: str(r.phone), service: str(r.service),
    date: str(r.date), time: str(r.time), message: str(r.message), notes: str(r.notes),
    status: isStatus(status) ? status : "New", isDemo: r.is_demo === true, createdAt: str(r.created_at),
  };
}
function toEnquiry(r: Rec): Enquiry {
  return {
    _id: str(r.id), name: str(r.name), phone: str(r.phone), course: str(r.course),
    message: str(r.message), isDemo: r.is_demo === true, createdAt: str(r.created_at),
  };
}

export async function listAppointments(): Promise<Appointment[]> {
  const res = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
  return unwrapList(res).map(toAppointment);
}
export async function updateAppointment(id: string, patch: { status?: Status; notes?: string }): Promise<void> {
  unwrap(await supabase.from("appointments").update(patch).eq("id", id));
  refresh();
}
export async function removeAppointment(id: string): Promise<void> {
  unwrap(await supabase.from("appointments").delete().eq("id", id));
  refresh();
}
export async function listEnquiries(): Promise<Enquiry[]> {
  const res = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  return unwrapList(res).map(toEnquiry);
}
export async function removeEnquiry(id: string): Promise<void> {
  unwrap(await supabase.from("enquiries").delete().eq("id", id));
  refresh();
}

export type Stats = {
  newBookings: number; totalBookings: number; enquiries: number; services: number; latest: Appointment[];
};

async function countRows(table: string, filter?: { column: string; value: string }): Promise<number> {
  const base = supabase.from(table).select("*", { count: "exact", head: true });
  const res = await (filter ? base.eq(filter.column, filter.value) : base);
  if (res.error) throw new Error(res.error.message);
  return res.count ?? 0;
}

export async function fetchStats(): Promise<Stats> {
  const [newBookings, totalBookings, enquiries, services, latest] = await Promise.all([
    countRows("appointments", { column: "status", value: "New" }),
    countRows("appointments"),
    countRows("enquiries"),
    countRows("items", { column: "kind", value: "service" }),
    supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(5),
  ]);
  return { newBookings, totalBookings, enquiries, services, latest: unwrapList(latest).map(toAppointment) };
}

// ---------- content items ----------
export type ItemDoc = { _id: string; kind: string; order: number; visible: boolean; data: Rec };

export async function listItems(kind: string): Promise<ItemDoc[]> {
  const res = await supabase.from("items").select("*").eq("kind", kind).order("order", { ascending: true });
  return unwrapList(res).map((r) => ({
    _id: str(r.id), kind: str(r.kind), order: num(r.order), visible: r.visible !== false, data: rec(r.data),
  }));
}

export async function upsertItem(id: string | undefined, kind: string, data: Rec): Promise<void> {
  if (id) {
    unwrap(await supabase.from("items").update({ data }).eq("id", id));
  } else {
    const last = unwrapList(
      await supabase.from("items").select("order").eq("kind", kind).order("order", { ascending: false }).limit(1),
    );
    const next = last.length > 0 ? num(last[0].order) + 1 : 0;
    unwrap(await supabase.from("items").insert({ kind, order: next, visible: true, data }));
  }
  refresh();
}

export async function setVisible(id: string, visible: boolean): Promise<void> {
  unwrap(await supabase.from("items").update({ visible }).eq("id", id));
  refresh();
}

export async function removeItem(id: string): Promise<void> {
  unwrap(await supabase.from("items").delete().eq("id", id));
  refresh();
}

// Renumbers the whole kind so equal or gapped orders never block a move
export async function moveItem(item: ItemDoc, direction: "up" | "down"): Promise<void> {
  const list = await listItems(item.kind);
  const from = list.findIndex((i) => i._id === item._id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= list.length) return;
  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  await Promise.all(
    next.map(async (it, index) => {
      if (it.order !== index) unwrap(await supabase.from("items").update({ order: index }).eq("id", it._id));
    }),
  );
  refresh();
}

// ---------- settings ----------
export async function setSetting(key: string, value: Rec | { list: unknown[] }): Promise<void> {
  unwrap(
    await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" }),
  );
  refresh();
}

async function fetchSiteData(): Promise<SiteData> {
  const rows = unwrapList(await supabase.from("settings").select("key, value"));
  const settings: Record<string, unknown> = {};
  for (const r of rows) settings[str(r.key)] = r.value;
  return toSiteData({ seeded: true, settings, items: {} });
}

// Admin pages edit the same merged settings the public site reads
export function useSiteData(): SiteData | undefined {
  return useLoad(fetchSiteData, "site-data");
}

// ---------- media ----------
export type MediaDoc = { _id: string; url: string; name: string; alt: string; path: string };

export async function listMedia(): Promise<MediaDoc[]> {
  const res = await supabase.from("media").select("*").order("created_at", { ascending: false });
  return unwrapList(res).map((r) => ({
    _id: str(r.id), url: str(r.url), name: str(r.name), alt: str(r.alt), path: str(r.storage_path),
  }));
}

export async function uploadMedia(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const up = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (up.error) throw new Error(up.error.message);
  const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  unwrap(await supabase.from("media").insert({ storage_path: path, url, name: file.name, alt: "" }));
  refresh();
  return url;
}

export async function updateAlt(id: string, alt: string): Promise<void> {
  unwrap(await supabase.from("media").update({ alt }).eq("id", id));
  refresh();
}

export async function removeMedia(m: MediaDoc): Promise<void> {
  await supabase.storage.from("media").remove([m.path]);
  unwrap(await supabase.from("media").delete().eq("id", m._id));
  refresh();
}
