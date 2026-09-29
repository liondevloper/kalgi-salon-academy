import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Trash2, UserPlus } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import PageHeader from "../_components/PageHeader.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";
import { withToast } from "../_lib/fields.ts";

export default function AccessPage() {
  const admins = useQuery(api.admin.access.listAdmins, {});
  const add = useMutation(api.admin.access.addAdmin);
  const remove = useMutation(api.admin.access.removeAdmin);
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (await withToast(() => add({ email }), "Admin added")) setEmail("");
  };

  return (
    <>
      <PageHeader title="Admins" />
      <p className="mb-4 text-sm text-muted-foreground">
        To add someone, ask them to open /admin and sign in once, then enter their email here.
      </p>
      <form onSubmit={(e) => void submit(e)} className="mb-6 flex gap-2">
        <Input type="email" placeholder="staff@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit"><UserPlus className="size-4" /> Add</Button>
      </form>
      {admins === undefined ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <ul className="divide-y rounded-lg border">
          {admins.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-2 p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{a.name || a.email || "Admin"}</p>
                <p className="truncate text-muted-foreground">{a.email}</p>
              </div>
              <ConfirmDelete title="Remove this admin?" onConfirm={() => withToast(() => remove({ id: a._id }), "Removed")}>
                <Button size="icon" variant="ghost" className="text-destructive" aria-label="Remove"><Trash2 className="size-4" /></Button>
              </ConfirmDelete>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
