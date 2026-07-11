"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  showArrow?: boolean;
  className?: string;
  asChild?: boolean;
}

const MotionButton = motion.create(Button);

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  icon: Icon,
  iconPosition = "left",
  showArrow = false,
  className,
  ...props
}: AnimatedButtonProps) {
  const isPrimary = variant === "default";
  const isSecondary = variant === "outline" || variant === "secondary";

  // Hover transitions depending on the button style
  const primaryHover = {
    scale: 1.03,
    boxShadow: "0 12px 30px -8px rgba(235, 69, 17, 0.4), 0 4px 12px -4px rgba(235, 69, 17, 0.3)",
    transition: { duration: 0.2, ease: "easeOut" as const }
  };

  const secondaryHover = {
    scale: 1.01,
    borderColor: "rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 20px -8px rgba(255, 255, 255, 0.08), 0 0 10px 1px rgba(255, 255, 255, 0.04)",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    transition: { duration: 0.2, ease: "easeOut" as const }
  };

  const buttonTap = {
    scale: 0.98
  };

  // Variants for children icons to respond automatically to hover
  const iconVariants = {
    initial: { x: 0, rotate: 0 },
    hover: { 
      x: iconPosition === "right" || showArrow ? 4 : -4,
      rotate: Icon && iconPosition === "left" && !showArrow ? 5 : 0,
      transition: { type: "spring" as const, stiffness: 400, damping: 15 } 
    }
  };

  return (
    <MotionButton
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden group transition-all",
        isPrimary && "bg-primary text-primary-foreground border border-primary/20",
        isSecondary && "border-border text-foreground bg-muted/40",
        className
      )}
      whileHover={isPrimary ? primaryHover : isSecondary ? secondaryHover : { scale: 1.02 }}
      whileTap={buttonTap}
      initial="initial"
      animate="animate"
      {...(props as any)}
    >
      {Icon && iconPosition === "left" && (
        <motion.span variants={iconVariants} className="inline-flex mr-2">
          <Icon className="w-4 h-4" />
        </motion.span>
      )}
      
      <span>{children}</span>

      {Icon && iconPosition === "right" && !showArrow && (
        <motion.span variants={iconVariants} className="inline-flex ml-2">
          <Icon className="w-4 h-4" />
        </motion.span>
      )}

      {showArrow && (
        <motion.span variants={iconVariants} className="inline-flex ml-2">
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      )}
    </MotionButton>
  );
}
