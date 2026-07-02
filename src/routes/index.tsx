import { createFileRoute } from "@tanstack/react-router";
import { Splash } from "@/features/auth/splash";

export const Route = createFileRoute("/")({
  component: Splash,
});
