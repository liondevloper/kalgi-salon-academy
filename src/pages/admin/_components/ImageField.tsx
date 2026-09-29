import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { errorMessage, uploadMedia } from "@/lib/supabase-admin.ts";

type Props = { value: string; onChange: (v: string) => void };

export default function ImageField({ value, onChange }: Props) {
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
      onChange(await uploadMedia(file));
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
