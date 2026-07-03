import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GoldButton } from "@/components/GoldButton";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Operator Access — ResoFlex OS™" },
      { name: "description", content: "Login to your ResoFlex OS operator terminal." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function Login() {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Session initiated");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md glass-panel rounded-xl p-8">
        <div className="text-center mb-6">
          <Lock className="size-7 mx-auto text-gold" />
          <div className="text-telemetry mt-3">// SECURE ACCESS</div>
          <h1 className="font-display text-3xl font-bold mt-1">Operator Login</h1>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="OPERATOR EMAIL" type="email" placeholder="operator@resofit.fit" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field label="PASSPHRASE" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <GoldButton size="lg" className="w-full" disabled={busy} type="submit">{busy ? "Authenticating…" : "Initiate session"}</GoldButton>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          New to the network? <Link to="/register" search={{ ref: "" }} className="text-gold hover:underline">Provision access →</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-telemetry">{label}</span>
      <input {...rest} className="mt-2 w-full bg-background/60 border border-gold/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"/>
    </label>
  );
}
