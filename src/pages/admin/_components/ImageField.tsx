import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { errorMessage } from "../_lib/fields.ts";

// Hook shared by the image field and the Media page
export function useUpload() {
  const getUrl = useMutation(api.admin.media.generateUploadUrl);
  const save = useMutation(api.admin.media.saveMedia);
  return async (file: File): Promise<string> => {
    const uploadUrl = await getUrl({});
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed");
    const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
    return await save({ storageId, name: file.name, alt: "" });
  };
}

type Props = { value: string; onChange: (v: string) => void };

export default function ImageField({ value, onChange }: Props) {
  const upload = useUpload();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setBusy(true);
    try {
      onChange(await upload(file));
    } catch (e) {
      toast.error(errorMessage(e, "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {value ? (
        <img src={value} alt="" className="size-10 shrink-0 rounded-md border object-cover" />
      ) : (
        <div className="size-10 shrink-0 rounded-md border bg-muted" />
      )}
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
      <Button type="button" variant="secondary" size="icon" onClick={() => ref.current?.click()} disabled={busy} aria-label="Upload image">
        {busy ? <Spinner /> : <Upload className="size-4" />}
      </Button>
    </div>
  );
}
