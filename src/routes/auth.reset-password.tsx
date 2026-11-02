import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/features/auth/shell";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — SwiftShip Logistics" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Set a new password"
      footer={<Link to="/auth/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw !== confirm) return toast.error("Passwords do not match");
          toast.success("Password updated");
          navigate({ to: "/auth/login" });
        }}
        className="space-y-3"
      >
        <div>
          <Label className="text-xs">New password</Label>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Confirm password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" size="lg" className="w-full">Update password</Button>
      </form>
    </AuthShell>
  );
}