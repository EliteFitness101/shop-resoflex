import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldButton } from "@/components/GoldButton";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: Register,
  head: () => ({
    meta: [
      { title: "Provision Access — ResoFlex OS™" },
      { name: "description", content: "Register as a ResoFlex operator. Begin your sovereign performance protocol." },
      { property: "og:url", content: "/register" },
    ],
    links: [{ rel: "canonical", href: "/register" }],
  }),
});

function Register() {
  const [busy, setBusy] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { toast.success("Account scaffold — enable Cloud to go live"); setBusy(false); }, 700);
  };
  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md glass-panel rounded-xl p-8">
        <div className="text-center mb-6">
          <UserPlus className="size-7 mx-auto text-gold" />
          <div className="text-telemetry mt-3">// ENROLL</div>
          <h1 className="font-display text-3xl font-bold mt-1">Provision Operator</h1>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="FULL NAME" placeholder="Adebayo Tunde"/>
          <Field label="OPERATOR EMAIL" type="email" placeholder="operator@resofit.fit"/>
          <Field label="PASSPHRASE" type="password" placeholder="min 10 characters"/>
          <Field label="REFERRAL CODE (OPTIONAL)" placeholder="RSFX-XXXX"/>
          <GoldButton size="lg" className="w-full" disabled={busy} type="submit">{busy ? "Provisioning…" : "Provision access"}</GoldButton>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already enrolled? <Link to="/login" className="text-gold hover:underline">Initiate session →</Link>
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
