import { Link } from "react-router-dom";
import { CalendarCheck, GraduationCap, Inbox, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { fetchStats, useLoad } from "@/lib/supabase-admin.ts";
import PageHeader from "../_components/PageHeader.tsx";

export default function DashboardPage() {
  const stats = useLoad(fetchStats, "stats");
  const cards = [
    { label: "New bookings", value: stats?.newBookings, icon: Inbox, to: "/admin/bookings" },
    { label: "All bookings", value: stats?.totalBookings, icon: CalendarCheck, to: "/admin/bookings" },
    { label: "Course enquiries", value: stats?.enquiries, icon: GraduationCap, to: "/admin/enquiries" },
    { label: "Services", value: stats?.services, icon: Scissors, to: "/admin/content/service" },
  ];
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {c.value === undefined ? <Skeleton className="h-8 w-12" /> : <p className="text-3xl font-bold">{c.value}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 mt-8 font-semibold">Latest bookings</h2>
      {stats === undefined ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : stats.latest.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><CalendarCheck /></EmptyMedia>
            <EmptyTitle>No bookings yet</EmptyTitle>
            <EmptyDescription>Appointment requests from the website will show up here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="divide-y rounded-lg border">
          {stats.latest.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{a.name} · {a.service}</p>
                <p className="text-muted-foreground">{a.date} {a.time}</p>
              </div>
              <Badge variant={a.status === "New" ? "default" : "secondary"}>{a.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
