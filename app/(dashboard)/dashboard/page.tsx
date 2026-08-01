"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Link2,
  Pin,
  FolderClosed,
  ArrowRight,
  Sparkles,
  Youtube,
  BookOpen,
  TrendingUp,
  FileText,
  Clock,
  Plus
} from "lucide-react";
import { dbService } from "@/lib/services/database/db-service";
import { supabase } from "@/lib/supabase/client";
import { Workspace, ResearchTopic, Reference } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Data State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pinnedWorkspaces, setPinnedWorkspaces] = useState<Workspace[]>([]);
  const [recentReferences, setRecentReferences] = useState<Reference[]>([]);
  
  const [searchMode, setSearchMode] = useState<"research" | "analyze">("research");
  const [searchInput, setSearchInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
        if (fullName) {
          const firstName = fullName.split(" ")[0];
          setUserName(firstName);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  async function loadData() {
    const ws = await dbService.getWorkspaces();
    setWorkspaces(ws);
    setPinnedWorkspaces(ws.filter(w => w.is_pinned));

    // Load recent references from all topics
    const allRefs: Reference[] = [];
    for (const w of ws) {
      const topics = await dbService.getTopics(w.id);
      for (const t of topics) {
        const refs = await dbService.getReferences(t.id);
        allRefs.push(...refs);
      }
    }
    // Sort by created date desc and take top 4
    allRefs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRecentReferences(allRefs.slice(0, 4));
  }

  async function handleCreateWorkspace() {
    const title = prompt("Enter workspace name:");
    if (!title?.trim()) return;
    const newWs = await dbService.createWorkspace(title.trim(), "Newly created research hub.");
    loadData();
    router.push(`/workspace/${newWs.id}`);
  }

  async function handleTogglePin(id: string) {
    await dbService.togglePinWorkspace(id);
    loadData();
  }

  const handleModeSwitch = (mode: "research" | "analyze") => {
    setSearchMode(mode);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setIsSubmitting(true);
    setSubmitStatus(searchMode === "research" ? "Creating workspace..." : "Extracting content...");

    try {
      if (searchMode === "research") {
        const title = searchInput.trim();
        const targetWs = await dbService.createWorkspace(title, "Automatically generated research workspace.");
        const targetTopic = await dbService.createTopic(targetWs.id, title, "Primary research thread.");
        
        setSubmitStatus("Workspace created! Redirecting...");
        setSearchInput("");
        setTimeout(() => {
          setSubmitStatus(null);
          loadData();
          router.push(`/workspace/${targetWs.id}?topic=${targetTopic.id}&tab=research`);
        }, 800);
      } else {
        let targetWs = workspaces[0];
        if (!targetWs) {
          targetWs = await dbService.createWorkspace("My Research Workspace", "Default workspace created automatically.");
        }

        const topics = await dbService.getTopics(targetWs.id);
        let targetTopic = topics[0];
        if (!targetTopic) {
          targetTopic = await dbService.createTopic(targetWs.id, "Web Collections", "Topic created for fast URL dumps.");
        }

        let type: "youtube" | "link" = "link";
        let title = "Web Page Article";

        if (searchInput.includes("youtube.com") || searchInput.includes("youtu.be")) {
          type = "youtube";
          title = "YouTube Video Analysis";
        } else if (searchInput.includes("reddit.com")) {
          title = "Reddit Discussion Thread";
        }

        const cleanUrl = searchInput.trim();
        title = `${title}: ${cleanUrl.replace("https://", "").split("/")[0]}`;

        await dbService.addReference(targetTopic.id, title, cleanUrl, type);

        setSubmitStatus("Saved to Web Collections!");
        setSearchInput("");
        setTimeout(() => {
          setSubmitStatus(null);
          loadData();
          router.push(`/workspace/${targetWs.id}?topic=${targetTopic.id}`);
        }, 1200);
      }
    } catch (err) {
      setSubmitStatus("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 select-none">

      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {userName ? `${greeting}, ${userName}.` : `${greeting}.`}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Research a new topic or analyze existing content.</p>
        </div>
        <Button
          size="sm"
          onClick={handleCreateWorkspace}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[11px] h-7 px-3 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-3 h-3" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* Unified Search Section */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-2xl bg-card/60 backdrop-blur-sm border border-border px-6 py-5 rounded-[var(--radius)] shadow-sm relative overflow-hidden">
          
          {/* Segmented Toggle */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex gap-4 relative">
              <button
                type="button"
                onClick={() => handleModeSwitch("research")}
                className={cn(
                  "relative pb-1.5 text-[11px] font-semibold transition-colors duration-200",
                  searchMode === "research" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Research Topic
                {searchMode === "research" && (
                  <motion.div
                    layoutId="activeSearchTab"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch("analyze")}
                className={cn(
                  "relative pb-1.5 text-[11px] font-semibold transition-colors duration-200",
                  searchMode === "analyze" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Analyze URL
                {searchMode === "analyze" && (
                  <motion.div
                    layoutId="activeSearchTab"
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
            <div className="absolute left-3.5 top-[11px] flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {searchMode === "research" ? (
                  <motion.div
                    key="search-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-4 h-4 text-muted-foreground/60" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="link-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link2 className="w-4 h-4 text-muted-foreground/60" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Custom animated placeholder overlay */}
            {!searchInput && (
              <div className="absolute left-9 top-[11px] pointer-events-none flex items-center overflow-hidden text-muted-foreground/50 text-[13px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={searchMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {searchMode === "research" 
                      ? "Research AI Agents, System Design, Startups..." 
                      : "Paste a YouTube, LinkedIn, X, Reddit or Instagram URL..."}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
            
            <input
              ref={inputRef}
              type={searchMode === "analyze" ? "url" : "text"}
              required
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1 text-[13px] bg-muted/40 border border-border rounded-full pl-9 pr-3 py-2 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-foreground transition-all duration-200"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="h-[38px] px-5 min-w-[90px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-semibold shrink-0 relative overflow-hidden flex items-center justify-center"
              disabled={isSubmitting}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={searchMode}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {searchMode === "research" ? "Research" : "Analyze"}
                </motion.span>
              </AnimatePresence>
            </Button>
            
            {submitStatus && (
              <span className="absolute -bottom-5 left-4 text-[10px] font-medium text-primary">
                {submitStatus}
              </span>
            )}
          </form>
        </div>
      </div>

      {/* Pinned / Continue Working Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          <span>Active & Pinned Workspaces</span>
        </div>

        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.slice(0, 6).map(ws => (
              <Card key={ws.id} className="hover:border-primary/20 bg-card border-border transition-all p-5 rounded-[var(--radius)] relative flex flex-col justify-between min-h-[120px] group">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/workspace/${ws.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-xs font-bold text-foreground line-clamp-1">{ws.title}</h3>
                    </Link>
                    <button
                      onClick={() => handleTogglePin(ws.id)}
                      className="p-1 rounded-[calc(var(--radius)-4px)] hover:bg-[#141414] text-muted-foreground group-hover:opacity-100 transition-opacity"
                    >
                      <Pin className={`w-3.5 h-3.5 ${ws.is_pinned ? "fill-primary text-primary" : "text-muted-foreground/60"}`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">
                    {ws.description || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border/40 mt-4 pt-3 text-[10px] text-muted-foreground font-medium">
                  <span>{ws.topics_count || 0} active topics</span>
                  <Link href={`/workspace/${ws.id}`} className="text-primary hover:underline flex items-center gap-0.5">
                    <span>Open Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-border bg-card/10 rounded-[var(--radius)] text-center">
            <FolderClosed className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No workspaces found.</p>
            <Button variant="link" onClick={handleCreateWorkspace} className="text-xs text-primary font-bold mt-1">
              Create your first Workspace
            </Button>
          </div>
        )}
      </div>

      {/* References and Logs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent References */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2">
            <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Recent References Collected</span>
            </h2>
            <span className="text-[10px] font-bold text-muted-foreground">{recentReferences.length} total</span>
          </div>

          {recentReferences.length > 0 ? (
            <div className="divide-y divide-border/40">
              {recentReferences.map(ref => (
                <div key={ref.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
                  <div className="flex gap-2.5 overflow-hidden">
                    {ref.type === "youtube" ? (
                      <Youtube className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    )}
                    <div className="overflow-hidden">
                      <span className="font-semibold text-foreground block truncate">{ref.title}</span>
                      <a href={ref.url} target="_blank" rel="noreferrer" className="text-[10px] text-muted-foreground/80 hover:text-primary block truncate mt-0.5">
                        {ref.url}
                      </a>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 shrink-0 font-medium">
                    {new Date(ref.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Link2 className="w-6 h-6 text-muted-foreground/50 mx-auto mb-1.5" />
              <p className="text-[11px] text-muted-foreground">No references collected yet. Paste URLs above to add.</p>
            </div>
          )}
        </div>

        {/* Brand/Integration Info panel */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-4 border-b border-border/40 pb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Brand Guidelines</span>
            </div>
            <div className="bg-muted/40 p-3 border border-border rounded-[calc(var(--radius)-4px)] space-y-2">
              <span className="text-[10px] font-bold text-primary block">ACTIVE VOICE PROFILE</span>
              <span className="text-xs font-bold text-foreground block">Tech Architect Voice</span>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-4">
                Professional, dense, direct, highly technical, and calm. Explains complex concepts with zero fluff. Focuses on architecture, trade-offs, and metrics.
              </p>
            </div>
          </div>
          <Link href="/settings" className="mt-4">
            <Button variant="outline" className="w-full h-8 text-[11px] font-bold">
              Edit Voice Guidelines
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
