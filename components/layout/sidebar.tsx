"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FolderClosed, 
  Settings, 
  Search, 
  Plus, 
  Pin, 
  LogOut, 
  Compass, 
  ChevronRight, 
  Sparkles,
  BookOpen
} from "lucide-react";
import { dbService } from "@/lib/services/database/db-service";
import { Workspace } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newWsTitle, setNewWsTitle] = useState("");
  const [isAddingWs, setIsAddingWs] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    const data = await dbService.getWorkspaces();
    setWorkspaces(data);
  }

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!newWsTitle.trim()) return;
    const newWs = await dbService.createWorkspace(newWsTitle.trim(), "");
    setNewWsTitle("");
    setIsAddingWs(false);
    loadWorkspaces();
    router.push(`/workspace/${newWs.id}`);
  }

  async function handleTogglePin(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    await dbService.togglePinWorkspace(id);
    loadWorkspaces();
  }

  function handleLogout() {
    // Clear cookies & mock auth
    if (typeof window !== "undefined") {
      document.cookie = "relay-studio-mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/auth");
    }
  }

  const pinnedWorkspaces = workspaces.filter(w => w.is_pinned);
  const otherWorkspaces = workspaces.filter(w => !w.is_pinned);

  return (
    <aside className="w-64 border-r border-border bg-muted flex flex-col h-screen shrink-0 overflow-hidden select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-90 transition-opacity">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
            R
          </div>
          <span className="tracking-tight text-sm">RELAY STUDIO</span>
        </Link>
        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-text bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-border">
          Core
        </span>
      </div>

      {/* Main Navigation Links */}
      <div className="p-3 space-y-1">
        <Link 
          href="/dashboard"
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-[calc(var(--radius)-4px)] text-xs font-medium border transition-colors duration-150",
            pathname === "/dashboard" 
              ? "bg-card border-border text-foreground font-semibold" 
              : "text-muted-foreground border-transparent hover:bg-card/40 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-secondary" />
            <span>Discover Dashboard</span>
          </div>
        </Link>

        <Link 
          href="/settings"
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-[calc(var(--radius)-4px)] text-xs font-medium border transition-colors duration-150",
            pathname === "/settings" 
              ? "bg-card border-border text-foreground font-semibold" 
              : "text-muted-foreground border-transparent hover:bg-card/40 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Workspace Settings</span>
          </div>
        </Link>
      </div>

      <div className="h-[1px] bg-border mx-3" />

      {/* Workspaces Section */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="p-3 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Workspaces</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-4 h-4 p-0 hover:bg-accent/10 hover:text-foreground"
            onClick={() => setIsAddingWs(!isAddingWs)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Create workspace inline form */}
        <AnimatePresence>
          {isAddingWs && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateWorkspace}
              className="px-3 py-2 space-y-2 overflow-hidden"
            >
              <input 
                type="text"
                value={newWsTitle}
                onChange={e => setNewWsTitle(e.target.value)}
                placeholder="Workspace title..."
                className="w-full text-xs bg-card border border-border rounded px-2.5 py-1.5 focus:outline-none focus:border-primary text-foreground"
                autoFocus
              />
              <div className="flex justify-end gap-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] px-2"
                  onClick={() => setIsAddingWs(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-6 text-[10px] px-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Create
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Scrollable Workspaces List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
          {/* Pinned Section */}
          {pinnedWorkspaces.length > 0 && (
            <div className="space-y-0.5">
              <div className="px-2 text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                <Pin className="w-2.5 h-2.5 text-primary rotate-45" />
                <span>PINNED</span>
              </div>
              {pinnedWorkspaces.map(ws => (
                <WorkspaceLink 
                  key={ws.id} 
                  ws={ws} 
                  isActive={pathname?.startsWith(`/workspace/${ws.id}`)} 
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          )}

          {/* All Workspaces Section */}
          <div className="space-y-0.5">
            {pinnedWorkspaces.length > 0 && (
              <div className="px-2 text-[9px] font-bold text-muted-foreground">
                <span>ALL WORKSPACES</span>
              </div>
            )}
            {otherWorkspaces.length > 0 ? (
              otherWorkspaces.map(ws => (
                <WorkspaceLink 
                  key={ws.id} 
                  ws={ws} 
                  isActive={pathname?.startsWith(`/workspace/${ws.id}`)} 
                  onTogglePin={handleTogglePin}
                />
              ))
            ) : (
              pinnedWorkspaces.length === 0 && (
                <div className="px-3 py-6 text-center text-[11px] text-muted-foreground/60 border border-dashed border-border/40 rounded-md">
                  No workspaces found. Click + to create one.
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* User Section at bottom */}
      <div className="mt-auto p-3 border-t border-border bg-card/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-border flex items-center justify-center font-bold text-sm text-foreground shrink-0">
            K
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-foreground truncate">Knowledge Creator</span>
            <span className="text-[10px] text-muted-foreground truncate">creator@relay.studio</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-7 h-7 p-0 rounded-md text-muted-foreground hover:bg-accent/10 hover:text-foreground"
          onClick={handleLogout}
          title="Sign Out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </Button>
      </div>
    </aside>
  );
}

interface WorkspaceLinkProps {
  ws: Workspace;
  isActive: boolean;
  onTogglePin: (e: React.MouseEvent, id: string) => void;
}

function WorkspaceLink({ ws, isActive, onTogglePin }: WorkspaceLinkProps) {
  return (
    <Link 
      href={`/workspace/${ws.id}`}
      className={cn(
        "group w-full flex items-center justify-between px-2.5 py-1.5 rounded-[calc(var(--radius)-4px)] text-xs font-medium border transition-all duration-150",
        isActive 
          ? "bg-card border-border text-foreground font-semibold" 
          : "text-muted-foreground border-transparent hover:bg-card/40 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden pr-2">
        <FolderClosed className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground/80")} />
        <span className="truncate">{ws.title}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          onClick={(e) => onTogglePin(e, ws.id)}
          className={cn(
            "p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card hover:text-foreground",
            ws.is_pinned && "opacity-100 text-primary"
          )}
        >
          <Pin className={cn("w-3 h-3", ws.is_pinned ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
      </div>
    </Link>
  );
}
