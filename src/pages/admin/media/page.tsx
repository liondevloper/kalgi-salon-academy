import { useRef, useState } from "react";
import { Copy, Image, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { errorMessage, listMedia, removeMedia, updateAlt, uploadMedia, useLoad, withToast } from "@/lib/supabase-admin.ts";
import PageHeader from "../_components/PageHeader.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";

export default function MediaPage() {
  const list = useLoad(listMedia, "media");
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) await uploadMedia(f);
      }
      toast.success("Uploaded");
    } catch (e) {
      toast.error(errorMessage(e, "Upload failed"));
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  const pickBtn = (
    <Button onClick={() => ref.current?.click()} disabled={busy}>
      {busy ? <Spinner /> : <Upload className="size-4" />} Upload photos
    </Button>
  );

  return (
    <>
      <PageHeader title="Media" action={pickBtn} />
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void onFiles(e.target.files)} />
      {list === undefined ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
      ) : list.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Image /></EmptyMedia>
            <EmptyTitle>No photos yet</EmptyTitle>
            <EmptyDescription>Upload salon photos, then copy their link into any image field.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{pickBtn}</EmptyContent>
        </Empty>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {list.map((m) => (
            <li key={m._id} className="overflow-hidden rounded-lg border">
              <img src={m.url} alt={m.alt} className="aspect-square w-full object-cover" loading="lazy" />
              <div className="grid gap-2 p-2">
                <Input defaultValue={m.alt} placeholder="Alt text"
                  onBlur={(e) => e.target.value !== m.alt && void withToast(() => updateAlt(m._id, e.target.value))} />
                <div className="flex gap-1">
                  <Button size="sm" variant="secondary" className="flex-1"
                    onClick={() => void navigator.clipboard.writeText(m.url).then(() => toast.success("Link copied"))}>
                    <Copy className="size-4" /> Copy link
                  </Button>
                  <ConfirmDelete onConfirm={() => withToast(() => removeMedia(m), "Deleted")}>
                    <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete"><Trash2 className="size-4" /></Button>
                  </ConfirmDelete>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
