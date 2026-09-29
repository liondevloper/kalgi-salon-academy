import { useQuery } from "@tanstack/react-query";
import { GraduationCap, MessageCircle, Phone, Trash2 } from "lucide-react";
import { listEnquiries, removeEnquiry } from "@/lib/api/admin.ts";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { telLink, waLink } from "@/lib/data.ts";
import PageHeader from "../_components/PageHeader.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";
import { useAct } from "../_lib/use-admin.ts";

export default function EnquiriesPage() {
  const { data: list } = useQuery({ queryKey: ["admin", "enquiries"], queryFn: listEnquiries });
  const act = useAct();
  return (
    <>
      <PageHeader title="Course enquiries" />
      {list === undefined ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : list.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><GraduationCap /></EmptyMedia>
            <EmptyTitle>No enquiries yet</EmptyTitle>
            <EmptyDescription>Enquiries from the Academy page appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid gap-3">
          {list.map((e) => (
            <li key={e.id} className="grid gap-2 rounded-lg border p-4">
              <p className="font-semibold">{e.name} {e.isDemo && <Badge variant="secondary" className="ml-1">Demo</Badge>}</p>
              <p className="text-sm text-muted-foreground">{e.course || "Any course"} · {new Date(e.createdAt).toLocaleString()}</p>
              {e.message && <p className="text-sm">{e.message}</p>}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" asChild><a href={telLink(e.phone)}><Phone className="size-4" /> {e.phone}</a></Button>
                <Button size="sm" variant="secondary" asChild>
                  <a href={waLink(e.phone, `Hello ${e.name}, thank you for your enquiry at Kalgi Academy.`)} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </Button>
                <ConfirmDelete onConfirm={() => act(() => removeEnquiry(e.id), "Deleted")}>
                  <Button size="sm" variant="ghost" className="ml-auto text-destructive"><Trash2 className="size-4" /></Button>
                </ConfirmDelete>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
