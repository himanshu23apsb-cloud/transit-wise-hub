import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/features/auth/shell";
import { useAuth, roleHome } from "@/lib/mock/auth";
import type { Role } from "@/lib/mock/seed";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create account — SwiftShip" }] }),
  component: Register,
});

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [role, setRole] = useState<Role>("customer");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    const s = register({ name: form.name, email: form.email, phone: form.phone, role });
    toast.success("Account created");
    navigate({ to: roleHome(s.role) });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start shipping in minutes"
      footer={<>Already have one? <Link to="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label className="mb-1.5 block text-xs">I am a</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["customer", "driver", "admin"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={"rounded-lg border px-2 py-2 text-xs font-medium capitalize transition-colors " + (role === r ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted")}
              >{r}</button>
            ))}
          </div>
        </div>
        {[
          { key: "name", label: "Full name", type: "text" },
          { key: "email", label: "Email address", type: "email" },
          { key: "phone", label: "Phone number", type: "tel" },
          { key: "password", label: "Password", type: "password" },
          { key: "confirm", label: "Confirm password", type: "password" },
        ].map((f) => (
          <div key={f.key}>
            <Label className="text-xs">{f.label}</Label>
            <Input
              type={f.type}
              value={form[f.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="mt-1"
            />
          </div>
        ))}
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
    </AuthShell>
  );
}