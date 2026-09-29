import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { rec, type Item, type Rec } from "@/lib/data.ts";
import NotFound from "../../NotFound.tsx";
import PageHeader from "../_components/PageHeader.tsx";
import FieldsForm from "../_components/FieldsForm.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";
import { findKind, withToast, type KindConfig } from "../_lib/fields.ts";

type Editing = { id?: Id<"items">; data: Rec } | null;

function Editor({ config, editing, onClose }: { config: KindConfig; editing: Editing; onClose: () => void }) {
  const upsert = useMutation(api.admin.content.upsertItem);
  const categories = useQuery(api.admin.content.listItems, editing ? { kind: "category" } : "skip");
  const [draft, setDraft] = useState<Rec>(editing?.data ?? {});
  const cats: Item[] = (categories ?? []).map((c) => ({ _id: c._id, order: c.order, data: rec(c.data) }));

  const save = async () => {
    const ok = await withToast(() => upsert({ id: editing?.id, kind: config.kind, data: draft }));
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

function Row({ item, config, onEdit }: { item: Doc<"items">; config: KindConfig; onEdit: () => void }) {
  const move = useMutation(api.admin.content.moveItem);
  const setVisible = useMutation(api.admin.content.setVisible);
  const remove = useMutation(api.admin.content.removeItem);
  return (
    <li className="flex items-center gap-2 p-3">
      <span className={`min-w-0 flex-1 truncate text-sm ${item.visible ? "" : "text-muted-foreground line-through"}`}>
        {config.title(rec(item.data))}
      </span>
      <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => void move({ id: item._id, direction: "up" })}><ArrowUp className="size-4" /></Button>
      <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => void move({ id: item._id, direction: "down" })}><ArrowDown className="size-4" /></Button>
      <Button size="icon" variant="ghost" aria-label={item.visible ? "Hide" : "Show"}
        onClick={() => void withToast(() => setVisible({ id: item._id, visible: !item.visible }), item.visible ? "Hidden" : "Visible")}>
        {item.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </Button>
      <Button size="icon" variant="ghost" aria-label="Edit" onClick={onEdit}><Pencil className="size-4" /></Button>
      <ConfirmDelete onConfirm={() => withToast(() => remove({ id: item._id }), "Deleted")}>
        <Button size="icon" variant="ghost" aria-label="Delete" className="text-destructive"><Trash2 className="size-4" /></Button>
      </ConfirmDelete>
    </li>
  );
}

function KindList({ config }: { config: KindConfig }) {
  const items = useQuery(api.admin.content.listItems, { kind: config.kind });
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
            <Row key={it._id} item={it} config={config} onEdit={() => setEditing({ id: it._id, data: rec(it.data) })} />
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
