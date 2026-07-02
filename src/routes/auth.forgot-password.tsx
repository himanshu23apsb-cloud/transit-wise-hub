import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/features/auth/shell";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Freightly" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send a reset link to your inbox"
      footer={<Link to="/auth/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success(`Reset link sent to ${email}`);
          navigate({ to: "/auth/reset-password" });
        }}
        className="space-y-3"
      >
        <div>
          <Label className="text-xs">Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" placeholder="you@example.com" />
        </div>
        <Button type="submit" size="lg" className="w-full">Send reset link</Button>
      </form>
    </AuthShell>
  );
}