import { toast } from "sonner";
import { lo, type Rec } from "@/lib/data.ts";

export type FieldType = "l" | "lt" | "text" | "textarea" | "number" | "image" | "date" | "select" | "category";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
};

export type KindConfig = {
  kind: string;
  label: string;
  title: (d: Rec) => string;
  fields: Field[];
};

const name = (d: Rec) => lo(d.name).en || "Untitled";

export const KIND_CONFIGS: KindConfig[] = [
  {
    kind: "service",
    label: "Services",
    title: name,
    fields: [
      { key: "name", label: "Name", type: "l" },
      { key: "category", label: "Category", type: "category" },
      { key: "price", label: "Price (₹)", type: "text" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "badge", label: "Badge (e.g. Popular)", type: "l" },
    ],
  },
  {
    kind: "category",
    label: "Categories",
    title: name,
    fields: [
      { key: "key", label: "Key (short id, e.g. hair)", type: "text" },
      { key: "name", label: "Name", type: "l" },
    ],
  },
  {
    kind: "offer",
    label: "Offers",
    title: (d) => lo(d.title).en || "Untitled",
    fields: [
      { key: "title", label: "Title", type: "l" },
      { key: "desc", label: "Description", type: "lt" },
      { key: "bonus", label: "Bonus", type: "l" },
      { key: "price", label: "Price (₹)", type: "number" },
      { key: "oldPrice", label: "Old price (₹)", type: "number" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "endDate", label: "End date", type: "date" },
    ],
  },
  {
    kind: "bridal",
    label: "Bridal packages",
    title: name,
    fields: [
      { key: "name", label: "Name", type: "l" },
      { key: "desc", label: "Description", type: "lt" },
      { key: "features", label: "Features (one per line)", type: "lt" },
      { key: "price", label: "Price", type: "text" },
    ],
  },
  {
    kind: "gallery",
    label: "Gallery",
    title: (d) => `${String(d.type ?? "photo")} · ${String(d.category ?? "")}`,
    fields: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "photo", label: "Photo" },
          { value: "beforeafter", label: "Before & after" },
        ],
      },
      { key: "category", label: "Category", type: "category" },
      { key: "image", label: "Image (before, for pairs)", type: "image" },
      { key: "after", label: "After image (pairs only)", type: "image" },
      { key: "alt", label: "Alt text", type: "l" },
    ],
  },
  {
    kind: "course",
    label: "Courses",
    title: name,
    fields: [
      { key: "name", label: "Name", type: "l" },
      { key: "desc", label: "Description", type: "lt" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "fee", label: "Fee", type: "text" },
    ],
  },
  {
    kind: "team",
    label: "Team",
    title: (d) => `${lo(d.name).en} · ${lo(d.role).en}`,
    fields: [
      { key: "name", label: "Name", type: "l" },
      { key: "role", label: "Role", type: "l" },
      { key: "photo", label: "Photo", type: "image" },
      { key: "bio", label: "Bio", type: "lt" },
    ],
  },
  {
    kind: "testimonial",
    label: "Testimonials",
    title: (d) => String(d.name ?? "Untitled"),
    fields: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "text", label: "Text review" },
          { value: "screenshot", label: "Screenshot" },
        ],
      },
      { key: "name", label: "Client name", type: "text" },
      { key: "text", label: "Review text", type: "lt" },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "image", label: "Screenshot image", type: "image" },
    ],
  },
  {
    kind: "faq",
    label: "FAQ",
    title: (d) => lo(d.q).en || "Untitled",
    fields: [
      { key: "q", label: "Question", type: "l" },
      { key: "a", label: "Answer", type: "lt" },
    ],
  },
];

export const findKind = (kind: string | undefined): KindConfig | undefined =>
  KIND_CONFIGS.find((k) => k.kind === kind);

export const SETTINGS_FIELDS: Record<string, { label: string; fields: Field[] }> = {
  site: {
    label: "Business info",
    fields: [
      { key: "name", label: "Salon name", type: "text" },
      { key: "logo", label: "Logo", type: "image" },
      { key: "tagline", label: "Tagline", type: "l" },
      { key: "phone1", label: "Phone 1", type: "text" },
      { key: "phone2", label: "Phone 2", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text" },
      { key: "address", label: "Address", type: "lt" },
      { key: "plusCode", label: "Plus code", type: "text" },
      { key: "mapQuery", label: "Google Maps search text", type: "text" },
      { key: "instagram", label: "Instagram link", type: "text" },
      { key: "hMon", label: "Monday hours", type: "text" },
      { key: "hTue", label: "Tuesday hours", type: "text" },
      { key: "hWed", label: "Wednesday hours", type: "text" },
      { key: "hThu", label: "Thursday hours", type: "text" },
      { key: "hFri", label: "Friday hours", type: "text" },
      { key: "hSat", label: "Saturday hours", type: "text" },
      { key: "hSun", label: "Sunday hours", type: "text" },
      { key: "rating", label: "Google rating", type: "number" },
      { key: "reviewCount", label: "Google review count", type: "number" },
      { key: "reviewLink", label: "Google review link", type: "text" },
      { key: "footer", label: "Footer line", type: "l" },
    ],
  },
  hero: {
    label: "Hero",
    fields: [
      { key: "headline", label: "Headline", type: "l" },
      { key: "sub", label: "Sub line", type: "l" },
      { key: "image", label: "Hero image", type: "image" },
    ],
  },
  about: {
    label: "About",
    fields: [
      { key: "title", label: "Title", type: "l" },
      { key: "body", label: "Text", type: "lt" },
      { key: "image", label: "Image", type: "image" },
      ...[1, 2, 3, 4].flatMap((i): Field[] => [
        { key: `stat${i}Value`, label: `Stat ${i} number`, type: "number" },
        { key: `stat${i}Suffix`, label: `Stat ${i} suffix`, type: "text" },
        { key: `stat${i}Label`, label: `Stat ${i} label`, type: "l" },
      ]),
    ],
  },
  seo: {
    label: "SEO",
    fields: ["home", "book", "services", "academy", "offers", "gallery", "contact"].flatMap(
      (p): Field[] => [
        { key: `${p}Title`, label: `${p} page title`, type: "text" },
        { key: `${p}Desc`, label: `${p} page description`, type: "textarea" },
      ],
    ),
  },
};

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
