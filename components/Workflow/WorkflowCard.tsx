"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass: string;
  isDimmed: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function WorkflowCard({
  step,
  title,
  description,
  icon: Icon,
  iconColorClass,
  isDimmed,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: WorkflowCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation configurations for the card container
  const cardVariants = {
    initial: { 
      y: 0, 
      borderColor: "rgba(255, 255, 255, 0.06)",
      backgroundColor: "rgba(26, 26, 26, 0.4)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
    },
    hover: { 
      y: shouldReduceMotion ? 0 : -6, 
      borderColor: "rgba(255, 255, 255, 0.15)",
      backgroundColor: "rgba(26, 26, 26, 0.85)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)" 
    }
  };

  // Micro-animations for the internal icon
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: shouldReduceMotion ? 1 : 1.12, 
      rotate: shouldReduceMotion ? 0 : [0, -5, 5, 0], 
      transition: { duration: 0.4, ease: "easeInOut" as const } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      animate={isActive ? "hover" : "initial"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative p-5 border rounded-[var(--radius)] flex flex-col h-full transition-opacity duration-300 select-none cursor-pointer overflow-hidden group",
        isDimmed ? "opacity-40" : "opacity-100"
      )}
    >
      {/* Subtle orange ambient glow inside card when hovered */}
      <div 
        className={cn(
          "absolute -inset-2 bg-[radial-gradient(circle_at_center,rgba(235,69,17,0.06)_0%,transparent_60%)] pointer-events-none transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      />

      {/* Top row with step indicator & icon */}
      <div className="flex items-center justify-between mb-4 z-10">
        <motion.div 
          variants={iconVariants}
          className={cn(
            "w-8 h-8 rounded-[calc(var(--radius)-4px)] bg-[#141414] border border-border flex items-center justify-center transition-colors duration-300",
            isActive ? "border-primary/40 bg-[#141414]" : "group-hover:border-primary/30"
          )}
        >
          <Icon className={cn("w-4 h-4 transition-colors", iconColorClass)} />
        </motion.div>
        
        {/* Step Badge */}
        <span className={cn(
          "text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border bg-muted/60 transition-colors duration-300",
          isActive ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-border/80"
        )}>
          Step {step}
        </span>
      </div>

      {/* Title */}
      <h3 className={cn(
        "text-sm font-bold transition-colors duration-300 z-10",
        isActive ? "text-foreground" : "text-muted-text group-hover:text-foreground"
      )}>
        {step}. {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed z-10">
        {description}
      </p>

      {/* Subtle highlight border line on bottom of cards */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0"
      )} />
    </motion.div>
  );
}
