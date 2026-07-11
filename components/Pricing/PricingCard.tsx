"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedButton } from "@/components/Shared/AnimatedButton";
import { SectionReveal } from "@/components/Shared/SectionReveal";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  planName: string;
  title: string;
  description: string;
  price: string;
  pricePeriod: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
}

export function PricingCard({
  planName,
  title,
  description,
  price,
  pricePeriod,
  features,
  isPopular = false,
  ctaText,
  ctaHref,
}: PricingCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Basic card hover configuration
  const basicHover = {
    y: shouldReduceMotion ? 0 : -5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.3)",
    transition: { duration: 0.25, ease: "easeOut" as const }
  };

  // Professional card hover configuration (slightly more emphasis)
  const proHover = {
    y: shouldReduceMotion ? 0 : -7,
    borderColor: "rgba(235, 69, 17, 0.35)",
    boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.6), 0 0 25px 2px rgba(235, 69, 17, 0.15)",
    transition: { duration: 0.25, ease: "easeOut" as const }
  };

  // Breathing pulse for the recommended Pro Plan border/glow
  const breathingVariants = {
    animate: {
      borderColor: ["rgba(235, 69, 17, 0.15)", "rgba(235, 69, 17, 0.28)", "rgba(235, 69, 17, 0.15)"],
      boxShadow: [
        "0 4px 10px -1px rgba(0, 0, 0, 0.3), 0 0 12px 0px rgba(235, 69, 17, 0.05)",
        "0 4px 10px -1px rgba(0, 0, 0, 0.3), 0 0 22px 2px rgba(235, 69, 17, 0.12)",
        "0 4px 10px -1px rgba(0, 0, 0, 0.3), 0 0 12px 0px rgba(235, 69, 17, 0.05)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      whileHover={isPopular ? proHover : basicHover}
      variants={isPopular && !shouldReduceMotion ? breathingVariants : undefined}
      animate={isPopular && !shouldReduceMotion ? "animate" : undefined}
      initial={{ 
        y: 0, 
        borderColor: isPopular ? "rgba(235, 69, 17, 0.15)" : "rgba(255, 255, 255, 0.06)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
      className={cn(
        "p-6 border rounded-[var(--radius)] flex flex-col justify-between relative overflow-hidden select-none bg-card transition-all duration-300",
        isPopular ? "bg-primary/[0.02]" : "bg-card/40"
      )}
    >
      {/* Recommended Ribbon */}
      {isPopular && (
        <div className="absolute top-3.5 right-3.5 text-[8px] font-bold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-[calc(var(--radius)-6px)] tracking-wider shadow-sm shadow-primary/20">
          RECOMMENDED
        </div>
      )}

      {/* Plan Header */}
      <div>
        <span className={cn(
          "text-[10px] font-bold tracking-widest uppercase",
          isPopular ? "text-primary" : "text-muted-foreground"
        )}>
          {planName}
        </span>
        <h3 className="text-lg font-bold text-foreground mt-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>

        {/* Pricing tag */}
        <div className="mt-5 text-3xl font-black text-foreground flex items-baseline gap-1">
          {price} 
          <span className="text-xs font-semibold text-muted-foreground">
            {pricePeriod}
          </span>
        </div>

        {/* Features Checklist */}
        <ul className="mt-7 space-y-3 text-xs text-muted-foreground">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                isPopular ? "bg-primary" : "bg-muted-foreground/60"
              )} />
              <span className={cn(isPopular && "text-foreground/90")}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Link href={ctaHref} className="mt-9 block">
        <AnimatedButton
          variant={isPopular ? "default" : "outline"}
          className="w-full text-xs font-bold py-5"
        >
          {ctaText}
        </AnimatedButton>
      </Link>

    </motion.div>
  );
}

// Full section wrapping both plans
export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 border-t border-border bg-[#090909]">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Section Header */}
        <SectionReveal className="max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Flexible pricing for creator squads
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
            Start researching for free, upgrade as your team scales.
          </p>
        </SectionReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          
          {/* Free Plan */}
          <SectionReveal delay={0.1}>
            <PricingCard
              planName="Basic"
              title="Research Starter"
              description="Perfect for solo independent creators."
              price="$0"
              pricePeriod="/ forever"
              features={[
                "3 active Workspaces",
                "Up to 15 Reference Cards per topic",
                "Standard text editor workspace"
              ]}
              ctaText="Get Started Free"
              ctaHref="/auth"
            />
          </SectionReveal>

          {/* Pro Plan */}
          <SectionReveal delay={0.2}>
            <PricingCard
              planName="Pro"
              title="Relay Professional"
              description="Built for professional creators and teams."
              price="$24"
              pricePeriod="/ month"
              features={[
                "Unlimited Workspaces & Topics",
                "Unlimited reference documents",
                "Integrations with Notion & YouTube",
                "Active Workspace sync"
              ]}
              isPopular={true}
              ctaText="Go Pro"
              ctaHref="/auth"
            />
          </SectionReveal>

        </div>

      </div>
    </section>
  );
}
