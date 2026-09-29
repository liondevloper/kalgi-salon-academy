import { useState } from "react";
import { CalendarCheck, MessageCircle, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { telLink, waLink } from "@/lib/data.ts";
import {
  STATUSES, isStatus, listAppointments, removeAppointment, updateAppointment, useLoad, withToast, type Appointment,
} from "@/lib/supabase-admin.ts";
import PageHeader from "../_components/PageHeader.tsx";
import ConfirmDelete from "../_components/ConfirmDelete.tsx";

function Row({ a }: { a: Appointment }) {
  const [notes, setNotes] = useState(a.notes);
  return (
    <li className="grid gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{a.name} {a.isDemo && <Badge variant="secondary" className="ml-1">Demo</Badge>}</p>
          <p className="text-sm text-muted-foreground">{a.service} · {a.date} {a.time}</p>
          <p className="text-xs text-muted-foreground">Received {new Date(a.createdAt).toLocaleString()}</p>
          {a.message && <p className="mt-1 text-sm">{a.message}</p>}
        </div>
        <Select value={a.status} onValueChange={(s) => isStatus(s) && void withToast(() => updateAppointment(a._id, { status: s }))}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Textarea rows={2} placeholder="Private notes" value={notes} onChange={(e) => setNotes(e.target.value)}
        onBlur={() => notes !== a.notes && void withToast(() => updateAppointment(a._id, { notes }), "Notes saved")} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" asChild><a href={telLink(a.phone)}><Phone className="size-4" /> {a.phone}</a></Button>
        <Button size="sm" variant="secondary" asChild>
          <a href={waLink(a.phone, `Hello ${a.name}, your ${a.service} appointment on ${a.date} at ${a.time} is confirmed. - Kalgi Salon`)} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </Button>
        <ConfirmDelete onConfirm={() => withToast(() => removeAppointment(a._id), "Deleted")}>
          <Button size="sm" variant="ghost" className="ml-auto text-destructive"><Trash2 className="size-4" /></Button>
        </ConfirmDelete>
      </div>
    </li>
  );
}

export default function BookingsPage() {
  const list = useLoad(listAppointments, "appointments");
  const [filter, setFilter] = useState("all");
  const shown = (list ?? []).filter((a) => filter === "all" || a.status === filter);
  return (
    <>
      <PageHeader title="Bookings" />
      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="cursor-pointer">All</TabsTrigger>
          {STATUSES.map((s) => <TabsTrigger key={s} value={s} className="cursor-pointer">{s}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {list === undefined ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}</div>
      ) : shown.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><CalendarCheck /></EmptyMedia>
            <EmptyTitle>No bookings here</EmptyTitle>
            <EmptyDescription>New requests from the Book page appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid gap-3">{shown.map((a) => <Row key={a._id} a={a} />)}</ul>
      )}
    </>
  );
}
