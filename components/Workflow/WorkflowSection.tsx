"use client";

import React, { useState } from "react";
import { Search, BookOpen, BrainCircuit, FileText } from "lucide-react";
import { WorkflowCard } from "./WorkflowCard";
import { SectionReveal } from "@/components/Shared/SectionReveal";
import { motion } from "framer-motion";

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Research",
    description: "Query web articles, technical papers, and online discussions within a unified search workspace.",
    icon: Search,
    iconColorClass: "text-primary",
  },
  {
    step: 2,
    title: "References",
    description: "Save articles, paste YouTube URLs, and compile Reddit discussions into structured reference cards.",
    icon: BookOpen,
    iconColorClass: "text-secondary",
  },
  {
    step: 3,
    title: "Insights",
    description: "Synthesize takeaways and analyze core technical concepts with clean structured research notes.",
    icon: BrainCircuit,
    iconColorClass: "text-primary",
  },
  {
    step: 4,
    title: "Scripts",
    description: "Draft video outlines, publish posts, and write clean narrations side-by-side with your research.",
    icon: FileText,
    iconColorClass: "text-foreground",
  },
];

export function WorkflowSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map hovered index to a progress percentage along the connector track
  const getProgressWidth = () => {
    if (hoveredIndex === null) return "0%";
    const percentages = ["0%", "33.3%", "66.6%", "100%"];
    return percentages[hoveredIndex];
  };

  return (
    <section id="features" className="py-24 px-4 border-t border-border bg-card/5 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(235,69,17,0.015)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <SectionReveal className="text-center max-w-xl mx-auto mb-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Structured workflow for professional creators
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            From raw inputs to production scripts in four clean, distraction-free stages.
          </p>
        </SectionReveal>

        {/* Cards Grid with Connectors */}
        <div className="relative">
          
          {/* Connector Line (Desktop Only: lg screens) */}
          <div className="absolute top-[36px] left-[12.5%] right-[12.5%] h-[1.5px] bg-border/45 pointer-events-none hidden lg:block z-0">
            {/* Filled highlight segment */}
            <motion.div 
              className="absolute h-full left-0 bg-primary/80 shadow-[0_0_8px_rgba(235,69,17,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: getProgressWidth() }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
            {/* Pulsing indicator node on the progress tip */}
            {hoveredIndex !== null && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary border border-background shadow-[0_0_10px_2px_rgba(235,69,17,0.7)]"
                animate={{ 
                  left: getProgressWidth(),
                  scale: [1, 1.25, 1]
                }}
                transition={{ 
                  left: { type: "spring", stiffness: 80, damping: 15 },
                  scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
              />
            )}
          </div>

          {/* Cards Flex/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {WORKFLOW_STEPS.map((stepData, index) => {
              const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
              const isActive = hoveredIndex === index;

              return (
                <SectionReveal 
                  key={stepData.step} 
                  delay={index * 0.1}
                  yOffset={15}
                >
                  <WorkflowCard
                    step={stepData.step}
                    title={stepData.title}
                    description={stepData.description}
                    icon={stepData.icon}
                    iconColorClass={stepData.iconColorClass}
                    isDimmed={isDimmed}
                    isActive={isActive}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </SectionReveal>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
