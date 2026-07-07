"use client";

import { useEffect, useState } from "react";
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
import { Workspace, ResearchTopic, Reference } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  
  // Data State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pinnedWorkspaces, setPinnedWorkspaces] = useState<Workspace[]>([]);
  const [recentReferences, setRecentReferences] = useState<Reference[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [urlStatus, setUrlStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

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

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsSubmittingUrl(true);
    setUrlStatus("Extracting content...");

    try {
      // If there are no workspaces, create a default one
      let targetWs = workspaces[0];
      if (!targetWs) {
        targetWs = await dbService.createWorkspace("My Research Workspace", "Default workspace created automatically.");
      }

      // If there are no topics in this workspace, create a default one
      const topics = await dbService.getTopics(targetWs.id);
      let targetTopic = topics[0];
      if (!targetTopic) {
        targetTopic = await dbService.createTopic(targetWs.id, "Web Collections", "Topic created for fast URL dumps.");
      }

      // Classify url
      let type: "youtube" | "link" = "link";
      let title = "Web Page Article";
      
      if (urlInput.includes("youtube.com") || urlInput.includes("youtu.be")) {
        type = "youtube";
        title = "YouTube Video Analysis";
      } else if (urlInput.includes("reddit.com")) {
        title = "Reddit Discussion Thread";
      }

      // Extract details mock
      const cleanUrl = urlInput.trim();
      title = `${title}: ${cleanUrl.replace("https://", "").split("/")[0]}`;

      await dbService.addReference(targetTopic.id, title, cleanUrl, type);
      
      setUrlStatus("Saved to Web Collections!");
      setUrlInput("");
      setTimeout(() => {
        setUrlStatus(null);
        loadData();
        router.push(`/workspace/${targetWs.id}?topic=${targetTopic.id}`);
      }, 1200);
    } catch (err) {
      setUrlStatus("Failed to save reference.");
    } finally {
      setIsSubmittingUrl(false);
    }
  }

  // Filtered workspaces for search
  const filteredWorkspaces = workspaces.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 select-none">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Studio Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">Welcome back. Continue your structured research projects.</p>
        </div>
        <Button 
          size="sm" 
          onClick={handleCreateWorkspace}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* Large Input Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Card */}
        <div className="bg-card border border-border p-4.5 rounded-[var(--radius)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs mb-3">
              <Search className="w-4 h-4 text-primary" />
              <span>Workspace Search</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              Quickly find workspaces, research notes, and transcripts using keywords.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground/60" />
            <input 
              type="text" 
              placeholder="Search workspaces..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-[var(--radius)] pl-8.5 pr-3.5 py-2 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Paste URL Card */}
        <div className="bg-card border border-border p-4.5 rounded-[var(--radius)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs mb-3">
              <Link2 className="w-4 h-4 text-secondary" />
              <span>Quick URL Collector</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              Paste articles, YouTube videos, or Reddit threads to instantly add them to references.
            </p>
          </div>
          <form onSubmit={handleUrlSubmit} className="relative flex gap-2">
            <input 
              type="url" 
              required
              placeholder="https://youtube.com/watch?..." 
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="flex-1 text-xs bg-muted/40 border border-border rounded-[var(--radius)] px-3 py-2 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50"
              disabled={isSubmittingUrl}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="h-8.5 px-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-semibold shrink-0"
              disabled={isSubmittingUrl}
            >
              Collect
            </Button>
            {urlStatus && (
              <span className="absolute bottom-[-18px] left-0 text-[10px] font-medium text-primary">
                {urlStatus}
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

        {filteredWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkspaces.map(ws => (
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
            <p className="text-xs text-muted-foreground">No workspaces match your query.</p>
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
