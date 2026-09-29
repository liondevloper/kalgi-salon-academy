import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { rec, str } from "@/lib/data.ts";
import { SECTION_KEYS } from "@/lib/seed-data.ts";
import { setSetting, useSiteData, withToast } from "@/lib/supabase-admin.ts";
import PageHeader from "../_components/PageHeader.tsx";

type Entry = { key: string; visible: boolean };

// Keeps saved order and appends any section added later
function normalize(raw: unknown): Entry[] {
  const list = Array.isArray(raw) ? raw.map(rec) : [];
  const saved = list
    .filter((s) => (SECTION_KEYS as readonly string[]).includes(str(s.key)))
    .map((s) => ({ key: str(s.key), visible: s.visible !== false }));
  const missing = SECTION_KEYS.filter((k) => !saved.some((s) => s.key === k)).map((key) => ({ key, visible: true }));
  return [...saved, ...missing];
}

function Editor({ initial }: { initial: Entry[] }) {
  const [list, setList] = useState(initial);
  const swap = (i: number, j: number) => {
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };
  return (
    <>
      <ul className="divide-y rounded-lg border">
        {list.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2 p-3">
            <span className="flex-1 text-sm font-medium capitalize">{s.key}</span>
            <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => swap(i, i - 1)}><ArrowUp className="size-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => swap(i, i + 1)}><ArrowDown className="size-4" /></Button>
            <Switch checked={s.visible} aria-label={`Show ${s.key}`}
              onCheckedChange={(c) => setList(list.map((x) => (x.key === s.key ? { ...x, visible: c } : x)))} />
          </li>
        ))}
      </ul>
      <Button className="mt-4" onClick={() => void withToast(() => setSetting("sections", { list }))}>Save order</Button>
    </>
  );
}

export default function SectionsPage() {
  const data = useSiteData();
  return (
    <>
      <PageHeader title="Home sections" />
      <p className="mb-4 text-sm text-muted-foreground">Choose which sections appear on the home page and in what order.</p>
      {data === undefined ? <Skeleton className="h-96 w-full" /> : <Editor initial={normalize(data.settings.sections.list)} />}
    </>
  );
}
