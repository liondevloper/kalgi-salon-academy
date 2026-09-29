import { num, str, todayIso, type Item } from "./data.ts";

// Offers outside their start/end dates are hidden automatically
export function activeOffers(offers: Item[]): Item[] {
  const today = todayIso();
  return offers.filter((o) => {
    const start = str(o.data.startDate);
    const end = str(o.data.endDate);
    return (!start || start <= today) && (!end || end >= today);
  });
}

export const lines = (s: string): string[] =>
  s.split("\n").map((x) => x.trim()).filter(Boolean);

export const rupees = (n: unknown): string => {
  const v = num(n);
  return v > 0 ? `₹${v.toLocaleString("en-IN")}` : str(n);
};

export const TIME_SLOTS: string[] = Array.from({ length: 19 }, (_, i) => {
  const mins = 10 * 60 + i * 30;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m === 0 ? "00" : "30"} ${h >= 12 ? "PM" : "AM"}`;
});

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
