import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { errorMessage } from "../_lib/fields.ts";

const LION_LOGO = "https://hercules-cdn.com/file_pwJsTVBr8g9Ev0263ThFVblj";

// Email and password sign in only (Supabase Auth). Accounts are created by the owner, not on this page.
export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      toast.error(errorMessage(err, "Could not sign in"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="grid w-full max-w-sm gap-4 text-left">
      <div className="grid justify-items-center gap-2 text-center">
        {/* Source image has wide white margins, so scale it up inside a clipped box */}
        <div className="size-56 overflow-hidden rounded-2xl bg-white">
          <img src={LION_LOGO} alt="Lion Developer" className="size-full scale-[1.9] object-contain" />
        </div>
        <h1 className="text-2xl font-semibold">Kalgi Admin</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage bookings and website content.</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" autoComplete="email" placeholder="staff@gmail.com" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy}>
        {busy && <Spinner />} Sign in
      </Button>
      <p className="text-center text-xs text-muted-foreground">Made by Lion Developer</p>
    </form>
  );
}
