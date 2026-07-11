"use client";

import { Hero } from "@/components/Hero/Hero";
import { WorkflowSection } from "@/components/Workflow/WorkflowSection";
import { PricingSection } from "@/components/Pricing/PricingCard";
import { SectionReveal } from "@/components/Shared/SectionReveal";

export default function MarketingPage() {
  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">
      <Hero />
      <WorkflowSection />
      <PricingSection />
    </div>
  );
}
