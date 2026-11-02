import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/shell";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify email — SwiftShip Logistics" }] }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <AuthShell title="Verify your email" subtitle="We sent a link to your inbox. Click it to activate your account.">
      <div className="grid place-items-center rounded-2xl border bg-card p-8">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Mail className="h-8 w-8" />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">Didn't get the email? Check your spam folder.</div>
      </div>
      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={() => toast.success("Verification email resent")}>Resend email</Button>
        <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/auth/otp" })}>Use OTP instead</Button>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}