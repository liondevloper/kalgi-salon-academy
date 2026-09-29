import { useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarCheck, GraduationCap, Image, LayoutDashboard, LayoutList, Menu, Palette, Settings, ShieldCheck, Sparkles,
} from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { cn } from "@/lib/utils.ts";
import { KIND_CONFIGS, withToast } from "./_lib/fields.ts";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/enquiries", label: "Enquiries", icon: GraduationCap },
  ...KIND_CONFIGS.map((k) => ({ to: `/admin/content/${k.kind}`, label: k.label, icon: Sparkles })),
  { to: "/admin/settings", label: "Site settings", icon: Settings },
  { to: "/admin/sections", label: "Home sections", icon: LayoutList },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/access", label: "Admins", icon: ShieldCheck },
];

function NavList({ onPick }: { onPick?: () => void }) {
  return (
    <nav className="grid gap-0.5 p-2">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to} to={to} end={end} onClick={onPick}
          className={({ isActive }) => cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="size-4" /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-background p-6 text-center">{children}</div>;
}

function Gate() {
  const me = useQuery(api.admin.access.me, {});
  const claim = useMutation(api.admin.access.claim);
  const [open, setOpen] = useState(false);

  if (me === undefined) return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  if (!me.isAdmin) {
    return (
      <Center>
        <div className="max-w-sm space-y-4">
          <ShieldCheck className="mx-auto size-10 text-muted-foreground" />
          {me.canClaim ? (
            <>
              <h1 className="text-xl font-semibold">Set up the owner account</h1>
              <p className="text-sm text-muted-foreground">No admin exists yet. Make {me.email ?? "this account"} the owner.</p>
              <Button onClick={() => void withToast(() => claim({}), "You are now the owner")}>Become owner</Button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold">No admin access</h1>
              <p className="text-sm text-muted-foreground">{me.email ?? "This account"} is not an admin. Ask the owner to add you.</p>
            </>
          )}
          <div className="flex justify-center gap-2">
            <SignInButton variant="secondary" />
            <Button variant="ghost" asChild><Link to="/">Back to site</Link></Button>
          </div>
        </div>
      </Center>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 border-r md:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          <p className="px-5 pt-5 text-lg font-semibold">Kalgi Admin</p>
          <NavList />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 overflow-y-auto p-0">
              <SheetTitle className="px-5 pt-5">Kalgi Admin</SheetTitle>
              <NavList onPick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="truncate text-sm text-muted-foreground">{me.email}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/">View site</Link></Button>
            <SignInButton size="sm" variant="secondary" />
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <>
      <AuthLoading><div className="p-6"><Skeleton className="h-screen w-full" /></div></AuthLoading>
      <Unauthenticated>
        <Center>
          <div className="max-w-sm space-y-4">
            <ShieldCheck className="mx-auto size-10 text-primary" />
            <h1 className="text-2xl font-semibold">Kalgi Admin</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage bookings and website content.</p>
            <SignInButton />
          </div>
        </Center>
      </Unauthenticated>
      <Authenticated><Gate /></Authenticated>
    </>
  );
}
