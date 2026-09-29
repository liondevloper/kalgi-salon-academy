import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { errorMessage } from "../_lib/fields.ts";

// Email and password sign in (Supabase Auth). Staff create their account once, then the owner adds them.
export default function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        await signIn(email.trim(), password);
      } else {
        const { needsConfirmation } = await signUp(email.trim(), password);
        if (needsConfirmation) toast.success("Check your email to confirm your account, then sign in.");
      }
    } catch (err) {
      toast.error(errorMessage(err, "Could not sign in"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="grid w-full max-w-sm gap-4 text-left">
      <div className="grid justify-items-center gap-2 text-center">
        <ShieldCheck className="size-10 text-primary" />
        <h1 className="text-2xl font-semibold">Kalgi Admin</h1>
        <p className="text-sm text-muted-foreground">
          {mode === "in" ? "Sign in to manage bookings and website content." : "Create your staff account."}
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" autoComplete="email" placeholder="staff@gmail.com" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" required minLength={6}
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy}>
        {busy && <Spinner />} {mode === "in" ? "Sign in" : "Create account"}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
      </Button>
    </form>
  );
}
