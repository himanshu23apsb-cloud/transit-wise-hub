import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthShell } from "@/features/auth/shell";
import { useAuth, roleHome } from "@/lib/mock/auth";
import type { Role } from "@/lib/mock/seed";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — SwiftShip Logistics" }] }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("demo@swiftship.com");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState<Role>("customer");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = login(identifier, password, role);
    toast.success(`Welcome back, ${s.name}`);
    navigate({ to: roleHome(s.role) });
  };

  const quick = (r: Role) => {
    const s = login(`${r}@swiftship.com`, "demo", r);
    toast.success(`Signed in as ${r}`);
    navigate({ to: roleHome(s.role) });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your shipments"
      footer={
        <>
          Don't have an account? <Link to="/auth/register" className="font-medium text-primary hover:underline">Create one</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label className="mb-1.5 block text-xs">Sign in as</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["customer", "driver", "admin"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={
                  "rounded-lg border px-2 py-2 text-xs font-medium capitalize transition-colors " +
                  (role === r ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted")
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-4 space-y-3">
            <div>
              <Label htmlFor="email" className="text-xs">Email address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="pl-9" placeholder="you@example.com" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="phone" className="mt-4 space-y-3">
            <div>
              <Label htmlFor="phone" className="text-xs">Phone number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" type="tel" onChange={(e) => setIdentifier(e.target.value)} className="pl-9" placeholder="+91 90000 00000" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pw" className="text-xs">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
          </div>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" />
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg">Sign in</Button>
      </form>
      <div className="mt-6">
        <div className="mb-2 text-center text-xs uppercase tracking-wider text-muted-foreground">Demo shortcuts</div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => quick("customer")}>Customer</Button>
          <Button variant="outline" size="sm" onClick={() => quick("driver")}>Driver</Button>
          <Button variant="outline" size="sm" onClick={() => quick("admin")}>Admin</Button>
        </div>
      </div>
    </AuthShell>
  );
}