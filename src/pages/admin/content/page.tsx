import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { listItems, moveItem, removeItem, setItemVisible, upsertItem, type AdminItem } from "@/lib/api/admin.ts";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import type { Item, Rec } from "@/lib/data.ts";
import NotFound from "../../NotFound.tsx";
import PageHeader from "../_components/PageHeader.tsx";
import FieldsForm from "../_components/FieldsForm.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";
import { findKind, type KindConfig } from "../_lib/fields.ts";
import { useAct } from "../_lib/use-admin.ts";

type Editing = { id?: string; data: Rec } | null;

function Editor({ config, editing, onClose }: { config: KindConfig; editing: Editing; onClose: () => void }) {
  const act = useAct();
  const categories = useQuery({
    queryKey: ["admin", "items", "category"],
    queryFn: () => listItems("category"),
    enabled: editing !== null,
  });
  const [draft, setDraft] = useState<Rec>(editing?.data ?? {});
  const cats: Item[] = (categories.data ?? []).map((c) => ({ _id: c.id, order: c.order, data: c.data }));

  const save = async () => {
    const ok = await act(() => upsertItem({ id: editing?.id, kind: config.kind, data: draft }));
    if (ok) onClose();
  };

  return (
    <Dialog open={editing !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} {config.label.toLowerCase()}</DialogTitle></DialogHeader>
        <FieldsForm fields={config.fields} value={draft} onChange={setDraft} categories={cats} />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void save()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ item, config, onEdit }: { item: AdminItem; config: KindConfig; onEdit: () => void }) {
  const act = useAct();
  return (
    <li className="flex items-center gap-2 p-3">
      <span className={`min-w-0 flex-1 truncate text-sm ${item.visible ? "" : "text-muted-foreground line-through"}`}>
        {config.title(item.data)}
      </span>
      <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => void act(() => moveItem(item.id, "up"), "Moved")}><ArrowUp className="size-4" /></Button>
      <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => void act(() => moveItem(item.id, "down"), "Moved")}><ArrowDown className="size-4" /></Button>
      <Button size="icon" variant="ghost" aria-label={item.visible ? "Hide" : "Show"}
        onClick={() => void act(() => setItemVisible(item.id, !item.visible), item.visible ? "Hidden" : "Visible")}>
        {item.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </Button>
      <Button size="icon" variant="ghost" aria-label="Edit" onClick={onEdit}><Pencil className="size-4" /></Button>
      <ConfirmDelete onConfirm={() => act(() => removeItem(item.id), "Deleted")}>
        <Button size="icon" variant="ghost" aria-label="Delete" className="text-destructive"><Trash2 className="size-4" /></Button>
      </ConfirmDelete>
    </li>
  );
}

function KindList({ config }: { config: KindConfig }) {
  const { data: items } = useQuery({
    queryKey: ["admin", "items", config.kind],
    queryFn: () => listItems(config.kind),
  });
  const [editing, setEditing] = useState<Editing>(null);
  const add = () => setEditing({ data: {} });
  return (
    <>
      <PageHeader title={config.label} action={<Button onClick={add}><Plus className="size-4" /> Add</Button>} />
      {items === undefined ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Sparkles /></EmptyMedia>
            <EmptyTitle>Nothing here yet</EmptyTitle>
            <EmptyDescription>Add the first entry to show it on the website.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button size="sm" onClick={add}>Add</Button></EmptyContent>
        </Empty>
      ) : (
        <ul className="divide-y rounded-lg border">
          {items.map((it) => (
            <Row key={it.id} item={it} config={config} onEdit={() => setEditing({ id: it.id, data: it.data })} />
          ))}
        </ul>
      )}
      {editing && <Editor key={editing.id ?? "new"} config={config} editing={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

export default function ContentPage() {
  const { kind } = useParams();
  const config = findKind(kind);
  if (!config) return <NotFound />;
  return <KindList key={config.kind} config={config} />;
}
