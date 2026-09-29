import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, UserPlus } from "lucide-react";
import { addAdmin, listAdmins, removeAdmin } from "@/lib/api/admin.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import PageHeader from "../_components/PageHeader.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";
import { useAct } from "../_lib/use-admin.ts";

export default function AccessPage() {
  const admins = useQuery({ queryKey: ["admin", "admins"], queryFn: listAdmins });
  const act = useAct();
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (await act(() => addAdmin(email), "Admin added")) setEmail("");
  };

  return (
    <>
      <PageHeader title="Admins" />
      <p className="mb-4 text-sm text-muted-foreground">
        To add someone, ask them to open /admin and create an account once, then enter their email here.
      </p>
      <form onSubmit={(e) => void submit(e)} className="mb-6 flex gap-2">
        <Input type="email" placeholder="staff@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit"><UserPlus className="size-4" /> Add</Button>
      </form>
      {admins.data === undefined ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <ul className="divide-y rounded-lg border">
          {admins.data.map((a) => (
            <li key={a.userId} className="flex items-center justify-between gap-2 p-3 text-sm">
              <p className="min-w-0 truncate font-medium">{a.email || "Admin"}</p>
              <ConfirmDelete title="Remove this admin?" onConfirm={() => act(() => removeAdmin(a.userId), "Removed")}>
                <Button size="icon" variant="ghost" className="text-destructive" aria-label="Remove"><Trash2 className="size-4" /></Button>
              </ConfirmDelete>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
