"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";

export default function MarketingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-4 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[75vh]">
        
        {/* Subtle top indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-muted-text bg-[#141414] border border-border mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing Relay Studio Foundation</span>
        </motion.div>

        {/* Hero title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl text-foreground leading-[1.05]"
        >
          Research once. <br />
          <span className="text-primary">Create everywhere.</span>
        </motion.h1>

        {/* Hero subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed"
        >
          Relay Studio is the structured research workspace built specifically for knowledge creators. 
          Stop switching between ChatGPT, YouTube, Reddit, Google Docs and Notion. 
          Research, organize and transform knowledge inside one workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <Link href="/auth">
            <Button size="lg" className="h-11 px-6 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
              <span>Start Researching</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-11 px-6 text-xs font-bold flex items-center gap-2 text-foreground">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Demo</span>
          </Button>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 border-t border-border bg-card/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-bold tracking-tight">Structured workflow for professional creators</h2>
            <p className="text-xs text-muted-foreground mt-2">
              From raw inputs to production scripts in four clean, distraction-free stages.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Feature 1: Research */}
            <motion.div variants={itemVariants} className="p-5 border border-border bg-card rounded-[var(--radius)] flex flex-col h-full hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="w-8 h-8 rounded-[calc(var(--radius)-4px)] bg-[#141414] border border-border flex items-center justify-center text-primary mb-4">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">1. Research</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Query web articles, technical papers, and online discussions within a unified search workspace.
              </p>
            </motion.div>

            {/* Feature 2: References */}
            <motion.div variants={itemVariants} className="p-5 border border-border bg-card rounded-[var(--radius)] flex flex-col h-full hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="w-8 h-8 rounded-[calc(var(--radius)-4px)] bg-[#141414] border border-border flex items-center justify-center text-secondary mb-4">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">2. References</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Save articles, paste YouTube URLs, and compile Reddit discussions into structured reference cards.
              </p>
            </motion.div>

            {/* Feature 3: Insights */}
            <motion.div variants={itemVariants} className="p-5 border border-border bg-card rounded-[var(--radius)] flex flex-col h-full hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="w-8 h-8 rounded-[calc(var(--radius)-4px)] bg-[#141414] border border-border flex items-center justify-center text-primary mb-4">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">3. Insights</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Synthesize takeaways and analyze core technical concepts with clean structured research notes.
              </p>
            </motion.div>

            {/* Feature 4: Scripts */}
            <motion.div variants={itemVariants} className="p-5 border border-border bg-card rounded-[var(--radius)] flex flex-col h-full hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="w-8 h-8 rounded-[calc(var(--radius)-4px)] bg-[#141414] border border-border flex items-center justify-center text-foreground mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">4. Scripts</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Draft video outlines, publish posts, and write clean narrations side-by-side with your research.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section (Placeholder) */}
      <section id="pricing" className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight">Flexible pricing for creator squads</h2>
            <p className="text-xs text-muted-foreground mt-2">
              Start researching for free, upgrade as your team scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {/* Free Plan */}
            <div className="p-6 border border-border bg-card rounded-[var(--radius)] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Basic</span>
                <h3 className="text-lg font-bold text-foreground mt-1">Research Starter</h3>
                <p className="text-xs text-muted-foreground mt-1">Perfect for solo independent creators.</p>
                <div className="mt-4 text-3xl font-black text-foreground">
                  $0 <span className="text-xs font-semibold text-muted-foreground">/ forever</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>3 active Workspaces</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Up to 15 Reference Cards per topic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Standard text editor workspace</span>
                  </li>
                </ul>
              </div>
              <Link href="/auth" className="mt-8">
                <Button variant="outline" className="w-full text-xs font-bold">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 border border-primary/20 bg-primary/5 rounded-[var(--radius)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[8px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-[calc(var(--radius)-6px)] tracking-wider">
                RECOMMENDED
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Pro</span>
                <h3 className="text-lg font-bold text-foreground mt-1">Relay Professional</h3>
                <p className="text-xs text-muted-foreground mt-1">Built for professional creators and teams.</p>
                <div className="mt-4 text-3xl font-black text-foreground">
                  $24 <span className="text-xs font-semibold text-muted-foreground">/ month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">Unlimited Workspaces & Topics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">Unlimited reference documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">Integrations with Notion & YouTube</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">Active Workspace sync</span>
                  </li>
                </ul>
              </div>
              <Link href="/auth" className="mt-8">
                <Button className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
