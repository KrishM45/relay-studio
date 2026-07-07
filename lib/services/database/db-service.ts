import { Workspace, ResearchTopic, Reference, ResearchNote, GeneratedScript, BrandProfile, Integration } from "@/types";
import { DUMMY_WORKSPACES, DUMMY_TOPICS, DUMMY_REFERENCES, DUMMY_NOTES, DUMMY_SCRIPTS, DUMMY_BRAND_PROFILE, DUMMY_INTEGRATIONS } from "@/lib/constants/dummy-data";
import { supabase } from "@/lib/supabase/client";

// Local storage key helpers
const KEYS = {
  WORKSPACES: "relay_studio_workspaces",
  TOPICS: "relay_studio_topics",
  REFERENCES: "relay_studio_references",
  NOTES: "relay_studio_notes",
  SCRIPTS: "relay_studio_scripts",
  BRAND: "relay_studio_brand",
  INTEGRATIONS: "relay_studio_integrations"
};

// Check if we are running in the browser
const isClient = typeof window !== "undefined";

// Helper to initialize local storage with dummy data if not already present
function initLocalStorage() {
  if (!isClient) return;
  if (!localStorage.getItem(KEYS.WORKSPACES)) {
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(DUMMY_WORKSPACES));
  }
  if (!localStorage.getItem(KEYS.TOPICS)) {
    localStorage.setItem(KEYS.TOPICS, JSON.stringify(DUMMY_TOPICS));
  }
  if (!localStorage.getItem(KEYS.REFERENCES)) {
    localStorage.setItem(KEYS.REFERENCES, JSON.stringify(DUMMY_REFERENCES));
  }
  if (!localStorage.getItem(KEYS.NOTES)) {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(DUMMY_NOTES));
  }
  if (!localStorage.getItem(KEYS.SCRIPTS)) {
    localStorage.setItem(KEYS.SCRIPTS, JSON.stringify(DUMMY_SCRIPTS));
  }
  if (!localStorage.getItem(KEYS.BRAND)) {
    localStorage.setItem(KEYS.BRAND, JSON.stringify(DUMMY_BRAND_PROFILE));
  }
  if (!localStorage.getItem(KEYS.INTEGRATIONS)) {
    localStorage.setItem(KEYS.INTEGRATIONS, JSON.stringify(DUMMY_INTEGRATIONS));
  }
}

// Initialize on import
initLocalStorage();

// Helper to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("placeholder-project");
}

export const dbService = {
  // WORKSPACES
  async getWorkspaces(): Promise<Workspace[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });
      if (!error && data) return data as Workspace[];
    }
    
    // Fallback to local storage
    if (isClient) {
      const stored = localStorage.getItem(KEYS.WORKSPACES);
      if (stored) {
        const workspaces = JSON.parse(stored) as Workspace[];
        // Count topics for each
        const topics = JSON.parse(localStorage.getItem(KEYS.TOPICS) || "[]") as ResearchTopic[];
        return workspaces.map(ws => ({
          ...ws,
          topics_count: topics.filter(t => t.workspace_id === ws.id).length
        }));
      }
    }
    return DUMMY_WORKSPACES;
  },

  async createWorkspace(title: string, description: string): Promise<Workspace> {
    const newWs: Workspace = {
      id: "ws-" + Math.random().toString(36).substr(2, 9),
      user_id: "user-1",
      title,
      description,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      topics_count: 0
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("workspaces")
        .insert({ title, description })
        .select()
        .single();
      if (!error && data) return data as Workspace;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.WORKSPACES);
      const workspaces = stored ? JSON.parse(stored) : [...DUMMY_WORKSPACES];
      workspaces.unshift(newWs);
      localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(workspaces));
    }
    return newWs;
  },

  async togglePinWorkspace(id: string): Promise<Workspace | null> {
    if (isSupabaseConfigured()) {
      // Fetch current state
      const { data: current } = await supabase.from("workspaces").select("is_pinned").eq("id", id).single();
      if (current) {
        const { data, error } = await supabase
          .from("workspaces")
          .update({ is_pinned: !current.is_pinned })
          .eq("id", id)
          .select()
          .single();
        if (!error && data) return data as Workspace;
      }
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.WORKSPACES);
      if (stored) {
        const workspaces = JSON.parse(stored) as Workspace[];
        const idx = workspaces.findIndex(ws => ws.id === id);
        if (idx !== -1) {
          workspaces[idx].is_pinned = !workspaces[idx].is_pinned;
          workspaces[idx].updated_at = new Date().toISOString();
          localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(workspaces));
          return workspaces[idx];
        }
      }
    }
    return null;
  },

  // TOPICS
  async getTopics(workspaceId: string): Promise<ResearchTopic[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("research_topics")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });
      if (!error && data) return data as ResearchTopic[];
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.TOPICS);
      if (stored) {
        const topics = JSON.parse(stored) as ResearchTopic[];
        const filtered = topics.filter(t => t.workspace_id === workspaceId);
        
        const refs = JSON.parse(localStorage.getItem(KEYS.REFERENCES) || "[]") as Reference[];
        const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || "[]") as ResearchNote[];

        return filtered.map(t => ({
          ...t,
          references_count: refs.filter(r => r.topic_id === t.id).length,
          notes_count: notes.filter(n => n.topic_id === t.id).length
        }));
      }
    }
    return DUMMY_TOPICS.filter(t => t.workspace_id === workspaceId);
  },

  async createTopic(workspaceId: string, title: string, description: string): Promise<ResearchTopic> {
    const newTopic: ResearchTopic = {
      id: "topic-" + Math.random().toString(36).substr(2, 9),
      workspace_id: workspaceId,
      title,
      description,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      references_count: 0,
      notes_count: 0
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("research_topics")
        .insert({ workspace_id: workspaceId, title, description, status: "draft" })
        .select()
        .single();
      if (!error && data) return data as ResearchTopic;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.TOPICS);
      const topics = stored ? JSON.parse(stored) : [...DUMMY_TOPICS];
      topics.unshift(newTopic);
      localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
    }
    return newTopic;
  },

  // REFERENCES
  async getReferences(topicId: string): Promise<Reference[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("references")
        .select("*")
        .eq("topic_id", topicId)
        .order("created_at", { ascending: false });
      if (!error && data) return data as Reference[];
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.REFERENCES);
      if (stored) {
        const references = JSON.parse(stored) as Reference[];
        return references.filter(r => r.topic_id === topicId);
      }
    }
    return DUMMY_REFERENCES.filter(r => r.topic_id === topicId);
  },

  async addReference(topicId: string, title: string, url?: string, type: "link" | "youtube" | "reddit" | "pdf" | "document" = "link", rawContent?: string): Promise<Reference> {
    const newRef: Reference = {
      id: "ref-" + Math.random().toString(36).substr(2, 9),
      topic_id: topicId,
      title,
      url,
      type,
      raw_content: rawContent,
      summary: url ? `Analyzed summary of references linked at ${url}. Key insights extracted.` : "Manually added source document content notes.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("references")
        .insert({ topic_id: topicId, title, url, type, raw_content: rawContent, summary: newRef.summary })
        .select()
        .single();
      if (!error && data) return data as Reference;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.REFERENCES);
      const references = stored ? JSON.parse(stored) : [...DUMMY_REFERENCES];
      references.unshift(newRef);
      localStorage.setItem(KEYS.REFERENCES, JSON.stringify(references));
      
      // Touch topic update date
      this.touchTopic(topicId);
    }
    return newRef;
  },

  // RESEARCH NOTES
  async getNotes(topicId: string): Promise<ResearchNote[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("research_notes")
        .select("*")
        .eq("topic_id", topicId)
        .order("updated_at", { ascending: false });
      if (!error && data) return data as ResearchNote[];
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.NOTES);
      if (stored) {
        const notes = JSON.parse(stored) as ResearchNote[];
        const filtered = notes.filter(n => n.topic_id === topicId);
        if (filtered.length > 0) return filtered;
      }
    }
    
    const fallback = DUMMY_NOTES.filter(n => n.topic_id === topicId);
    if (fallback.length === 0 && isClient) {
      // Auto-create a note placeholder for editing if empty
      return [await this.createNote(topicId, "Synthesized Insights", "Start drafting your synthesis here. Highlight key takeaways from references.")];
    }
    return fallback;
  },

  async createNote(topicId: string, title: string, content: string): Promise<ResearchNote> {
    const newNote: ResearchNote = {
      id: "note-" + Math.random().toString(36).substr(2, 9),
      topic_id: topicId,
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("research_notes")
        .insert({ topic_id: topicId, title, content })
        .select()
        .single();
      if (!error && data) return data as ResearchNote;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.NOTES);
      const notes = stored ? JSON.parse(stored) : [...DUMMY_NOTES];
      notes.unshift(newNote);
      localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
      this.touchTopic(topicId);
    }
    return newNote;
  },

  async updateNote(id: string, title: string, content: string): Promise<ResearchNote | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("research_notes")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as ResearchNote;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.NOTES);
      if (stored) {
        const notes = JSON.parse(stored) as ResearchNote[];
        const idx = notes.findIndex(n => n.id === id);
        if (idx !== -1) {
          notes[idx].title = title;
          notes[idx].content = content;
          notes[idx].updated_at = new Date().toISOString();
          localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
          this.touchTopic(notes[idx].topic_id);
          return notes[idx];
        }
      }
    }
    return null;
  },

  // SCRIPTS
  async getScripts(topicId: string): Promise<GeneratedScript[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("generated_scripts")
        .select("*")
        .eq("topic_id", topicId)
        .order("updated_at", { ascending: false });
      if (!error && data) return data as GeneratedScript[];
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.SCRIPTS);
      if (stored) {
        const scripts = JSON.parse(stored) as GeneratedScript[];
        const filtered = scripts.filter(s => s.topic_id === topicId);
        if (filtered.length > 0) return filtered;
      }
    }

    const fallback = DUMMY_SCRIPTS.filter(s => s.topic_id === topicId);
    if (fallback.length === 0 && isClient) {
      // Auto-create a script layout if empty
      return [await this.createScript(topicId, "Video Script Outline")];
    }
    return fallback;
  },

  async createScript(topicId: string, title: string): Promise<GeneratedScript> {
    const newScript: GeneratedScript = {
      id: "script-" + Math.random().toString(36).substr(2, 9),
      topic_id: topicId,
      title,
      outline: {
        "hook": "Introduce the topic with a compelling hook.",
        "body": "Add your primary points, structure, and supporting data.",
        "outro": "Finish with a clear call to action."
      },
      script_content: "# Video Title\n\n**Visual**: Set the stage.\n\n**Voiceover**: Start speaking here.",
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("generated_scripts")
        .insert({ topic_id: topicId, title, script_content: newScript.script_content, status: "draft" })
        .select()
        .single();
      if (!error && data) return data as GeneratedScript;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.SCRIPTS);
      const scripts = stored ? JSON.parse(stored) : [...DUMMY_SCRIPTS];
      scripts.unshift(newScript);
      localStorage.setItem(KEYS.SCRIPTS, JSON.stringify(scripts));
      this.touchTopic(topicId);
    }
    return newScript;
  },

  async updateScript(id: string, title: string, content: string, status: "draft" | "review" | "published" = "draft"): Promise<GeneratedScript | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("generated_scripts")
        .update({ title, script_content: content, status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as GeneratedScript;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.SCRIPTS);
      if (stored) {
        const scripts = JSON.parse(stored) as GeneratedScript[];
        const idx = scripts.findIndex(s => s.id === id);
        if (idx !== -1) {
          scripts[idx].title = title;
          scripts[idx].script_content = content;
          scripts[idx].status = status;
          scripts[idx].updated_at = new Date().toISOString();
          localStorage.setItem(KEYS.SCRIPTS, JSON.stringify(scripts));
          this.touchTopic(scripts[idx].topic_id);
          return scripts[idx];
        }
      }
    }
    return null;
  },

  // BRAND PROFILES
  async getBrandProfile(): Promise<BrandProfile> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("is_active", true)
        .single();
      if (!error && data) return data as BrandProfile;
    }

    if (isClient) {
      const stored = localStorage.getItem(KEYS.BRAND);
      if (stored) return JSON.parse(stored) as BrandProfile;
    }
    return DUMMY_BRAND_PROFILE;
  },

  async saveBrandProfile(profile: Partial<BrandProfile>): Promise<BrandProfile> {
    const current = await this.getBrandProfile();
    const updated: BrandProfile = {
      ...current,
      ...profile,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("brand_profiles")
        .update(profile)
        .eq("id", current.id)
        .select()
        .single();
      if (!error && data) return data as BrandProfile;
    }

    if (isClient) {
      localStorage.setItem(KEYS.BRAND, JSON.stringify(updated));
    }
    return updated;
  },

  // Helper to touch topic updated_at
  touchTopic(topicId: string) {
    if (!isClient) return;
    const topicsStored = localStorage.getItem(KEYS.TOPICS);
    if (topicsStored) {
      const topics = JSON.parse(topicsStored) as ResearchTopic[];
      const idx = topics.findIndex(t => t.id === topicId);
      if (idx !== -1) {
        topics[idx].updated_at = new Date().toISOString();
        localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
        
        // Also touch workspace
        this.touchWorkspace(topics[idx].workspace_id);
      }
    }
  },

  // Helper to touch workspace updated_at
  touchWorkspace(wsId: string) {
    if (!isClient) return;
    const wsStored = localStorage.getItem(KEYS.WORKSPACES);
    if (wsStored) {
      const workspaces = JSON.parse(wsStored) as Workspace[];
      const idx = workspaces.findIndex(ws => ws.id === wsId);
      if (idx !== -1) {
        workspaces[idx].updated_at = new Date().toISOString();
        localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(workspaces));
      }
    }
  }
};
