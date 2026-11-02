import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Package, MapPin, Wallet, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & FAQ — SwiftShip Logistics" }] }),
  component: Help,
});

const faqs = [
  {
    q: "How do I book a shipment?",
    a: "Open your dashboard and choose New shipment. Fill in pickup and delivery details, pick a vehicle type and priority, then confirm — you'll get a live tracking link right away.",
    icon: Package,
  },
  {
    q: "How does live tracking work?",
    a: "Every active shipment appears on the interactive map with animated markers. Tap a shipment to see its route, ETA, and driver details while it moves in real time.",
    icon: MapPin,
  },
  {
    q: "When and how do I pay?",
    a: "You can pay after delivery or prepay while booking. Payment status is shown on each shipment card, and receipts are available in your order history.",
    icon: Wallet,
  },
];

function Help() {
  return (
    <div className="min-h-screen mesh-bg">
      <header className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <PageHeader
          title="Help & FAQ"
          description="Answers to the questions we hear most at SwiftShip Logistics."
        />
        <div className="mt-6 rounded-2xl border bg-card p-5 soft-shadow">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <HelpCircle className="h-4 w-4 text-primary" /> Frequently asked
          </div>
          <Accordion type="single" collapsible className="mt-4">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <f.icon className="h-4 w-4 text-muted-foreground" />
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
