import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarCheck, GraduationCap, Image, LayoutDashboard, LayoutList, Menu, Palette, Settings, ShieldCheck, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { claimOwner, fetchAccess, signIn, signOut, signUp, useLoad, useSession, withToast, errorMessage } from "@/lib/supabase-admin.ts";
import { KIND_CONFIGS } from "./_lib/fields.ts";

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

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await withToast(() => signIn(email, password), "Signed in");
    setBusy(false);
  };
  const create = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      const instant = await signUp(email, password);
      toast.success(instant ? "Account created" : "Check your email to confirm, then sign in");
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <Center>
      <form onSubmit={(e) => void submit(e)} className="w-full max-w-sm space-y-4 text-left">
        <div className="space-y-2 text-center">
          <ShieldCheck className="mx-auto size-10 text-primary" />
          <h1 className="text-2xl font-semibold">Kalgi Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage bookings and website content.</p>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="a-email">Email</Label>
          <Input id="a-email" type="email" autoComplete="email" placeholder="owner@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="a-pass">Password</Label>
          <Input id="a-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>Sign in</Button>
        <Button type="button" variant="secondary" className="w-full" disabled={busy || !email || !password} onClick={() => void create()}>
          Create account (first time only)
        </Button>
        <Button variant="ghost" className="w-full" asChild><Link to="/">Back to site</Link></Button>
      </form>
    </Center>
  );
}

function Gate({ session }: { session: Session }) {
  const access = useLoad(() => fetchAccess(session.user.id), session.user.id);
  const [open, setOpen] = useState(false);
  const email = session.user.email ?? "";

  if (access === undefined) return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  if (!access.isAdmin) {
    return (
      <Center>
        <div className="max-w-sm space-y-4">
          <ShieldCheck className="mx-auto size-10 text-muted-foreground" />
          {access.canClaim ? (
            <>
              <h1 className="text-xl font-semibold">Set up the owner account</h1>
              <p className="text-sm text-muted-foreground">No admin exists yet. Make {email} the owner.</p>
              <Button onClick={() => void withToast(() => claimOwner(), "You are now the owner")}>Become owner</Button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold">No admin access</h1>
              <p className="text-sm text-muted-foreground">{email} is not an admin. Ask the owner to add you.</p>
            </>
          )}
          <div className="flex justify-center gap-2">
            <Button variant="secondary" onClick={() => void signOut()}>Sign out</Button>
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
          <span className="truncate text-sm text-muted-foreground">{email}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/">View site</Link></Button>
            <Button size="sm" variant="secondary" onClick={() => void signOut()}>Sign out</Button>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const session = useSession();
  if (session === undefined) return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  if (session === null) return <LoginScreen />;
  return <Gate session={session} />;
}
