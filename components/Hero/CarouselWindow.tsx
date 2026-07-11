"use client";

import React from "react";
import { 
  Search, 
  Link2, 
  Sparkles, 
  Youtube, 
  BookOpen, 
  FileText, 
  Clock, 
  Plus, 
  FolderClosed, 
  Layers, 
  ArrowRight,
  User,
  ExternalLink,
  BrainCircuit,
  MessageSquare,
  FileCode,
  LineChart,
  Grid
} from "lucide-react";
import { motion } from "framer-motion";

interface CarouselWindowProps {
  viewId: string;
}

export function CarouselWindow({ viewId }: CarouselWindowProps) {
  // Renders a macOS-style window header with three window controls
  const renderWindowHeader = (title: string, badge?: string) => (
    <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-border/80 text-[10px] text-muted-foreground select-none">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/35" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/35" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/35" />
      </div>
      <div className="font-semibold tracking-tight text-muted-text truncate max-w-[60%] flex items-center gap-1">
        <span>Relay Studio</span>
        <span className="opacity-50">/</span>
        <span className="text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-1.5 py-0.5 rounded-sm text-[8px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
        <div className="w-3.5 h-3.5 rounded-sm bg-[#1e1e1e] flex items-center justify-center border border-border/50">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/35" />
        </div>
      </div>
    </div>
  );

  switch (viewId) {
    case "dashboard":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[11px] overflow-hidden">
          {renderWindowHeader("Dashboard", "Overview")}
          <div className="flex-1 p-4 space-y-3 overflow-hidden flex flex-col justify-between">
            {/* Header / Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">Studio Dashboard</h4>
                <p className="text-[9px] text-muted-foreground">Welcome back, Research Lead. Let's create.</p>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[8px] font-bold">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>AI Core Active</span>
              </div>
            </div>

            {/* Main Action Block */}
            <div className="grid grid-cols-2 gap-3">
              {/* Search Block */}
              <div className="bg-[#141414]/90 border border-border/80 p-2.5 rounded-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-foreground font-bold mb-1">
                    <Search className="w-3.5 h-3.5 text-primary" />
                    <span>Workspace Search</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground leading-normal mb-2">
                    Query documents, notes & outline scripts.
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1.5 w-2.5 h-2.5 text-muted-foreground/40" />
                  <div className="w-full bg-[#0d0d0d] border border-border/60 rounded px-6 py-1 text-[8px] text-muted-foreground/50">
                    Search workspaces...
                  </div>
                </div>
              </div>

              {/* URL Collector */}
              <div className="bg-[#141414]/90 border border-border/80 p-2.5 rounded-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-foreground font-bold mb-1">
                    <Link2 className="w-3.5 h-3.5 text-secondary" />
                    <span>Quick Collector</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground leading-normal mb-2">
                    Parse YouTube links & articles instantly.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1 bg-[#0d0d0d] border border-border/60 rounded px-2 py-1 text-[8px] text-muted-foreground truncate">
                    https://youtube.com/watch?v=ws4...
                  </div>
                  <div className="bg-secondary text-secondary-foreground font-bold px-2 py-1 rounded text-[8px] flex items-center justify-center">
                    Collect
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Workspaces List */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase block">Pinned Workspaces</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border border-border bg-[#141414]/40 rounded flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-4 h-4 rounded bg-[#1e1e1e] flex items-center justify-center text-primary font-bold text-[8px]">W</div>
                    <span className="font-bold truncate text-[9px]">Space Colonization Outline</span>
                  </div>
                  <Clock className="w-2.5 h-2.5 text-muted-foreground/50 shrink-0" />
                </div>
                <div className="p-2 border border-border bg-[#141414]/40 rounded flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-4 h-4 rounded bg-[#1e1e1e] flex items-center justify-center text-secondary font-bold text-[8px]">T</div>
                    <span className="font-bold truncate text-[9px]">Quantum Error Correction</span>
                  </div>
                  <Clock className="w-2.5 h-2.5 text-muted-foreground/50 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "workspace":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Workspace: Mars Colonization", "Canvas")}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-24 border-r border-border/80 bg-[#0d0d0d] p-2 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 px-1 text-[8px] font-bold tracking-wider text-muted-foreground uppercase">
                  <Layers className="w-2.5 h-2.5" />
                  <span>Topics</span>
                </div>
                <div className="space-y-1">
                  <div className="px-1.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] truncate">
                    Solar Energy Plan
                  </div>
                  <div className="px-1.5 py-1 rounded text-muted-foreground hover:text-foreground text-[9px] truncate">
                    Atmospheric Chemistry
                  </div>
                  <div className="px-1.5 py-1 rounded text-muted-foreground hover:text-foreground text-[9px] truncate">
                    Regolith Shielding
                  </div>
                </div>
              </div>
              <div className="p-1.5 border border-dashed border-border rounded flex items-center justify-center text-[8px] text-muted-foreground gap-1 cursor-pointer">
                <Plus className="w-2.5 h-2.5" /> Add Topic
              </div>
            </div>

            {/* Workspace Main Area */}
            <div className="flex-1 p-3 flex gap-3 overflow-hidden">
              {/* References Panel */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-1 shrink-0">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-secondary" />
                    <span>References</span>
                  </span>
                  <span className="text-[8px] text-muted-foreground bg-[#141414] px-1.5 py-0.5 rounded border border-border">3 items</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  <div className="p-2 border border-border bg-[#141414] rounded">
                    <div className="flex items-center gap-1.5 text-primary text-[9px] font-semibold">
                      <Youtube className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">SpaceX Starship Mars Cargo Logistics</span>
                    </div>
                    <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                      Review of payload parameters, payload capacity to LEO (150t) vs Mars landing mass (100t).
                    </p>
                  </div>
                  <div className="p-2 border border-border bg-[#141414] rounded">
                    <div className="flex items-center gap-1.5 text-secondary text-[9px] font-semibold">
                      <BookOpen className="w-3 h-3 text-secondary shrink-0" />
                      <span className="truncate">Martian Soil and Plant Growth Potential</span>
                    </div>
                    <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                      Research paper detailing perchlorate reduction processes using genetically modified microbes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Research Notes Panel */}
              <div className="w-40 border border-border bg-[#141414]/30 rounded-md p-2.5 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-1 shrink-0">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3 text-primary" />
                    <span>Research Notes</span>
                  </span>
                  <span className="text-[7.5px] text-muted-foreground">Auto-saved</span>
                </div>
                <div className="flex-1 space-y-1.5 text-[8px]">
                  <div className="font-bold text-[9px] text-foreground border-b border-border/40 pb-1">
                    Greenhouse Solar Budgets
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    1. Mars solar constant is ~590 W/m² (Earth is 1361 W/m²).
                  </p>
                  <p className="text-muted-foreground leading-relaxed font-semibold text-secondary">
                    2. Dynamic heating loads: Night temperatures drop to -120°C.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    3. Target: 100kW continuous power buffer via portable reactors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "ai_results":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("AI Research Engine", "Active Synthesis")}
          <div className="flex-1 p-3.5 space-y-3 overflow-hidden flex flex-col">
            {/* Query Bar */}
            <div className="bg-[#141414] border border-border p-2 rounded flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-bold text-foreground truncate">
                  Query: What are the primary barriers to Martian food cultivation?
                </span>
              </div>
              <div className="text-[7.5px] text-muted-foreground shrink-0 border border-border/80 bg-[#1e1e1e] px-1.5 py-0.5 rounded">
                Refined: 4 Sources
              </div>
            </div>

            {/* Synthesized Response */}
            <div className="flex-1 bg-[#141414]/30 border border-border/80 rounded-md p-3 space-y-2 overflow-y-auto">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="font-bold text-[10px] text-foreground uppercase tracking-wider">Relay Synthesis</span>
              </div>
              <p className="text-[8.5px] text-muted-foreground leading-relaxed">
                Martian food cultivation is restricted by three primary parameters: high soil perchlorates (0.5–1.0 wt%) <sup className="text-primary font-bold">[1]</sup>, extreme lack of solar irradiance requiring supplemental light <sup className="text-secondary font-bold">[2]</sup>, and nitrogen deficiencies in Martian soil <sup className="text-primary font-bold">[3]</sup>.
              </p>
              <div className="p-2 bg-[#141414] border border-border rounded text-[8px] space-y-1">
                <div className="text-foreground font-bold">Key Recommendation:</div>
                <div className="text-muted-foreground">
                  Use bacterial wash (using anaerobes like <span className="text-secondary italic">Dechloromonas</span>) to extract chlorine and enrich nitrogen levels before planting.
                </div>
              </div>
            </div>

            {/* Sources list */}
            <div className="space-y-1">
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">Citations & References</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-border rounded truncate text-[7.5px]">
                  <span className="w-3.5 h-3.5 rounded bg-[#1e1e1e] flex items-center justify-center font-bold text-primary">1</span>
                  <span className="truncate text-muted-foreground font-medium">NASA Perchlorate Toxicology Paper</span>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-border rounded truncate text-[7.5px]">
                  <span className="w-3.5 h-3.5 rounded bg-[#1e1e1e] flex items-center justify-center font-bold text-secondary">2</span>
                  <span className="truncate text-muted-foreground font-medium">Mars Bio-agricultural Review 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "research_thread":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Research Thread", "Chat Synthesis")}
          <div className="flex-1 flex overflow-hidden">
            {/* Thread Chat Area */}
            <div className="flex-1 p-3 flex flex-col justify-between bg-[#0d0d0d]/30">
              <div className="space-y-2 overflow-y-auto flex-1 pr-1.5">
                {/* User Message */}
                <div className="flex items-start gap-2 max-w-[85%] self-end ml-auto">
                  <div className="bg-secondary/10 border border-secondary/20 p-2 rounded-lg text-foreground text-[8px] leading-relaxed">
                    How does the 0.38g gravity on Mars impact cardiovascular systems over multi-year stays?
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-2 max-w-[90%] mr-auto">
                  <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-primary text-[8px] shrink-0 font-bold">
                    R
                  </div>
                  <div className="bg-[#141414] border border-border p-2 rounded-lg space-y-1.5">
                    <p className="text-[8px] text-muted-foreground leading-relaxed">
                      Microgravity studies indicate bone mineral density losses of ~1% per month. However, at <span className="text-foreground font-semibold">0.38g (Martian gravity)</span>, cardiovascular degradation is expected to plateau significantly slower. 
                    </p>
                    <p className="text-[8px] text-muted-foreground leading-relaxed">
                      Analysis of NASA's Bed Rest analogs suggests moderate resistance training offsets up to 88% of plasma volume shrinkage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-2 relative">
                <input 
                  type="text" 
                  disabled
                  placeholder="Ask a follow-up query based on 14 references..."
                  className="w-full bg-[#141414] border border-border rounded-md px-3 py-1.5 text-[8px] text-muted-foreground/60 placeholder:text-muted-foreground/40 focus:outline-none"
                />
                <Sparkles className="absolute right-3 top-2 w-3.5 h-3.5 text-primary" />
              </div>
            </div>

            {/* Sidebar with Cited References */}
            <div className="w-24 border-l border-border bg-[#141414]/30 p-2 space-y-2 shrink-0">
              <span className="text-[7.5px] font-bold text-muted-foreground uppercase tracking-wider block">Thread Sources</span>
              <div className="space-y-1">
                <div className="p-1 border border-border bg-[#141414] rounded text-[7px] truncate text-muted-foreground">
                  NASA Twins Study (2019)
                </div>
                <div className="p-1 border border-border bg-[#141414] rounded text-[7px] truncate text-muted-foreground">
                  ESA Gravity Effects Lab
                </div>
                <div className="p-1 border border-border bg-[#141414] rounded text-[7px] truncate text-muted-foreground">
                  J. Aerospace Medicine
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "analyze_url":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Quick URL Collector", "Collector Mode")}
          <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
            {/* Input URL display */}
            <div className="space-y-1.5">
              <span className="text-[8px] text-muted-foreground font-bold tracking-wider uppercase block">Input Reference URL</span>
              <div className="flex items-center justify-between p-2 bg-[#141414] border border-border rounded">
                <div className="flex items-center gap-1.5 truncate">
                  <Youtube className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-bold text-foreground truncate text-[9px]">https://youtube.com/watch?v=kY4...</span>
                </div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary font-bold animate-pulse">
                  Processing
                </span>
              </div>
            </div>

            {/* Analyzer Progress */}
            <div className="border border-border/80 bg-[#141414]/50 rounded-md p-3.5 flex flex-col items-center justify-center text-center space-y-2.5">
              {/* Spinner */}
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/5" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t border-primary" 
                />
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h5 className="text-[9px] font-bold text-foreground">Extracting & Summarizing</h5>
                <p className="text-[8px] text-muted-foreground mt-0.5 max-w-[200px]">
                  Downloading YouTube audio transcript, running syntax extraction, and compiling references.
                </p>
              </div>
              {/* Fake Progress Bar */}
              <div className="w-36 h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>

            {/* Extracted preview snippet */}
            <div className="bg-[#141414]/20 border border-dashed border-border p-2 rounded text-[7.5px] flex items-center justify-between">
              <span className="text-muted-foreground italic truncate">"Starship Flight 5 represents a paradigm shift in launch vehicle reuse..."</span>
              <span className="text-primary font-bold shrink-0 ml-1.5">Transcript Read</span>
            </div>
          </div>
        </div>
      );

    case "insights":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Insights and Takeaways", "Semantic Synthesis")}
          <div className="flex-1 p-3.5 space-y-3 overflow-hidden flex flex-col">
            {/* Header */}
            <div>
              <span className="text-[7.5px] font-bold text-secondary uppercase tracking-wider block">Compiled Insights</span>
              <h4 className="text-[11px] font-bold text-foreground mt-0.5">Mars Mission Syntheses</h4>
            </div>

            {/* Insights Stack */}
            <div className="flex-1 grid grid-cols-3 gap-2.5 overflow-hidden">
              {/* Insight 1 */}
              <div className="bg-[#141414] border border-border p-2 rounded-md flex flex-col justify-between">
                <div>
                  <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-1.5">
                    <LineChart className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[8.5px] text-foreground leading-tight">Radiation Protection</div>
                  <p className="text-[7.5px] text-muted-foreground leading-normal mt-1">
                    Martian regolith (3m depth) yields shielding factor equivalent to Earth's atmosphere.
                  </p>
                </div>
                <span className="text-[7px] text-primary/75 font-semibold">Regolith Spec</span>
              </div>

              {/* Insight 2 */}
              <div className="bg-[#141414] border border-border p-2 rounded-md flex flex-col justify-between">
                <div>
                  <div className="w-5 h-5 rounded bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-1.5">
                    <BrainCircuit className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[8.5px] text-foreground leading-tight">Power Generation</div>
                  <p className="text-[7.5px] text-muted-foreground leading-normal mt-1">
                    Solar panels require dual-axis rotation + automated dust clearing wipers to sustain output.
                  </p>
                </div>
                <span className="text-[7px] text-secondary/75 font-semibold">Energy Spec</span>
              </div>

              {/* Insight 3 */}
              <div className="bg-[#141414] border border-border p-2 rounded-md flex flex-col justify-between">
                <div>
                  <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-foreground mb-1.5">
                    <FileCode className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[8.5px] text-foreground leading-tight">Soil Extraction</div>
                  <p className="text-[7.5px] text-muted-foreground leading-normal mt-1">
                    Perchlorates extraction yields oxygen byproducts via biochemical decomposition processes.
                  </p>
                </div>
                <span className="text-[7px] text-muted-foreground font-semibold">Bio Spec</span>
              </div>
            </div>

            {/* Footer Summary statistics */}
            <div className="flex justify-between items-center bg-[#141414]/30 border border-border p-1.5 rounded text-[7.5px] text-muted-foreground">
              <span>Dynamic Topics Analyzed: 14</span>
              <span className="text-secondary font-bold">Accuracy Index: 98.4%</span>
            </div>
          </div>
        </div>
      );

    case "create_view":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Workspace: Mars Script", "Editor")}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Editor */}
            <div className="flex-1 p-3 flex flex-col gap-2 border-r border-border/80">
              <div className="flex items-center justify-between border-b border-border/60 pb-1">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-primary" />
                  <span className="font-bold text-[9px] text-foreground">Video Script Outline.md</span>
                </div>
                <span className="text-[7.5px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-bold">
                  Editing
                </span>
              </div>
              <div className="flex-1 space-y-2 text-[8px] text-muted-foreground font-mono leading-relaxed overflow-y-auto pr-1">
                <div>
                  <span className="text-primary font-bold"># Heading 1: The Mars Gravity Challenge</span>
                </div>
                <div>
                  <span className="text-secondary font-bold">## Section 1: Intro (0:00 - 1:15)</span><br />
                  Hook: Most space channels focus on radiation, but the silent killer is 0.38g gravity.
                </div>
                <div>
                  <span className="text-secondary font-bold">## Section 2: Physiological Degradation (1:15 - 3:00)</span><br />
                  - Muscle atrophy details (NASA Twins Study references)<br />
                  - Plasma volume shrinkage mechanisms.
                </div>
              </div>
            </div>

            {/* Right side References Sidebar */}
            <div className="w-36 bg-[#0d0d0d] p-3 flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-1 border-b border-border/60 pb-1">
                <Layers className="w-3 h-3 text-secondary" />
                <span className="font-bold text-[8.5px] text-foreground">References Pane</span>
              </div>
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                <div className="p-1.5 bg-[#141414] border border-border rounded">
                  <div className="text-[7.5px] font-bold text-foreground truncate">NASA Gravity Data</div>
                  <p className="text-[6.5px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    Bone density depletion reaches plateaus under partial gravity environments.
                  </p>
                </div>
                <div className="p-1.5 bg-[#141414] border border-border rounded">
                  <div className="text-[7.5px] font-bold text-foreground truncate">Cardiology Journal</div>
                  <p className="text-[6.5px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    Orthostatic intolerance parameters in microgravity analog tests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "workspace_overview":
      return (
        <div className="w-full h-full flex flex-col bg-[#090909] text-foreground text-[10px] overflow-hidden">
          {renderWindowHeader("Workspace Hub", "Hub Overview")}
          <div className="flex-1 p-3.5 space-y-3 overflow-hidden flex flex-col">
            {/* Search and Filters */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-bold text-[11px] text-foreground flex items-center gap-1">
                <Grid className="w-3.5 h-3.5 text-primary" />
                <span>My Workspaces</span>
              </span>
              <div className="bg-[#141414] border border-border/80 px-2 py-0.5 rounded text-[8px] text-muted-foreground font-semibold">
                Filter: Recent
              </div>
            </div>

            {/* Grid of Workspaces */}
            <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto">
              <div className="p-2.5 bg-[#141414] border border-border hover:border-primary/30 rounded flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[9px] text-foreground truncate">Space Colonization Brief</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                    Video script details, physiological constraints, and propulsion systems analysis.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[7px] text-muted-foreground border-t border-border/40 pt-1.5 mt-2">
                  <span>8 references</span>
                  <span>Updated 2h ago</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#141414] border border-border hover:border-secondary/30 rounded flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[9px] text-foreground truncate">Quantum Error Correction</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                    Bacon-Shor codes, topological stabilizers, and superconducting qubit hardware architectures.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[7px] text-muted-foreground border-t border-border/40 pt-1.5 mt-2">
                  <span>14 references</span>
                  <span>Updated 1d ago</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#141414] border border-border hover:border-white/20 rounded flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[9px] text-foreground truncate">AGI Safety alignment</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  </div>
                  <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                    Reinforcement learning from human feedback, model evaluation frameworks, and utility limits.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[7px] text-muted-foreground border-t border-border/40 pt-1.5 mt-2">
                  <span>4 references</span>
                  <span>Updated 3d ago</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#141414] border border-border hover:border-white/20 rounded flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[9px] text-foreground truncate">Web3 Economics</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  </div>
                  <p className="text-[7.5px] text-muted-foreground mt-1 line-clamp-2">
                    DeFi liquidity curves, automated market makers (AMMs), and tokenomics distributions.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[7px] text-muted-foreground border-t border-border/40 pt-1.5 mt-2">
                  <span>6 references</span>
                  <span>Updated 5d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
