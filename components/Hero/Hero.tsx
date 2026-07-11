"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { AnimatedButton } from "@/components/Shared/AnimatedButton";
import { ResearchCarousel } from "./ResearchCarousel";

export function Hero() {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 px-4 max-w-6xl mx-auto flex items-center min-h-[80vh] overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-secondary/3 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
        
        {/* Left Column - Content */}
        <div className="lg:col-span-5 flex flex-col items-start text-left justify-center space-y-6 md:space-y-8 h-full">
          
          {/* Foundation Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-muted-text bg-[#141414] border border-border shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Introducing Relay Studio Foundation</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05] sm:leading-[1.02]"
            >
              Research once. <br />
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Create everywhere.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-xl"
            >
              Relay Studio is the structured research workspace built specifically for knowledge creators. 
              Stop switching between ChatGPT, YouTube, Reddit, Google Docs and Notion. 
              Research, organize and transform knowledge inside one workspace.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/auth" className="w-full sm:w-auto">
              <AnimatedButton 
                size="lg" 
                showArrow={true}
                className="h-11 px-6 text-xs font-bold w-full sm:w-auto"
              >
                Start Researching
              </AnimatedButton>
            </Link>
            <AnimatedButton 
              variant="outline" 
              size="lg" 
              icon={Play} 
              className="h-11 px-6 text-xs font-bold flex items-center gap-2 text-foreground"
            >
              Watch Demo
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Right Column - 3D Rotating Carousel Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-7 w-full flex items-center justify-center overflow-visible"
        >
          <ResearchCarousel />
        </motion.div>

      </div>
    </section>
  );
}
