import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { lo, num, str, type Item, type Rec } from "@/lib/data.ts";
import type { Field } from "../_lib/fields.ts";
import ImageField from "./ImageField.tsx";

const LANGS = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "gu", label: "ગુજરાતી" },
] as const;

type Props = {
  fields: Field[];
  value: Rec;
  onChange: (v: Rec) => void;
  categories?: Item[];
};

// Renders any list of fields; localized fields edit all three languages at once
export default function FieldsForm({ fields, value, onChange, categories = [] }: Props) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4">
      {fields.map((f) => {
        const id = `f-${f.key}`;
        if (f.type === "l" || f.type === "lt") {
          const cur = lo(value[f.key]);
          return (
            <fieldset key={f.key} className="grid gap-2 rounded-lg border p-3">
              <legend className="px-1 text-sm font-medium">{f.label}</legend>
              {LANGS.map((l) => (
                <div key={l.id} className="grid gap-1">
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                  {f.type === "lt" ? (
                    <Textarea rows={2} value={cur[l.id]} onChange={(e) => set(f.key, { ...cur, [l.id]: e.target.value })} />
                  ) : (
                    <Input value={cur[l.id]} onChange={(e) => set(f.key, { ...cur, [l.id]: e.target.value })} />
                  )}
                </div>
              ))}
            </fieldset>
          );
        }
        return (
          <div key={f.key} className="grid gap-1.5">
            <Label htmlFor={id}>{f.label}</Label>
            {f.type === "text" && <Input id={id} value={str(value[f.key])} onChange={(e) => set(f.key, e.target.value)} />}
            {f.type === "textarea" && <Textarea id={id} rows={2} value={str(value[f.key])} onChange={(e) => set(f.key, e.target.value)} />}
            {f.type === "number" && (
              <Input id={id} type="number" step="any" value={str(value[f.key])}
                onChange={(e) => set(f.key, e.target.value === "" ? "" : num(Number(e.target.value)))} />
            )}
            {f.type === "date" && <Input id={id} type="date" value={str(value[f.key])} onChange={(e) => set(f.key, e.target.value)} />}
            {f.type === "image" && <ImageField value={str(value[f.key])} onChange={(v) => set(f.key, v)} />}
            {(f.type === "select" || f.type === "category") && (
              <Select value={str(value[f.key]) || undefined} onValueChange={(v) => set(f.key, v)}>
                <SelectTrigger id={id} className="w-full"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  {(f.type === "select"
                    ? f.options ?? []
                    : categories.map((c) => ({ value: str(c.data.key), label: lo(c.data.name).en })).filter((o) => o.value)
                  ).map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      })}
    </div>
  );
}
