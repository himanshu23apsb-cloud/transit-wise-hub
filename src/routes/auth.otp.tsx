import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthShell } from "@/features/auth/shell";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({ meta: [{ title: "OTP verification — Freightly" }] }),
  component: Otp,
});

function Otp() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  return (
    <AuthShell title="Enter OTP" subtitle="We sent a 6-digit code to your phone">
      <div className="grid place-items-center">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={() => {
          if (code.length !== 6) return toast.error("Enter the 6-digit code");
          toast.success("Verified");
          navigate({ to: "/customer" });
        }}
      >
        Verify
      </Button>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}