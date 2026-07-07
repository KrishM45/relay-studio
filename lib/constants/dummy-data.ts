import { Workspace, ResearchTopic, Reference, ResearchNote, GeneratedScript, BrandProfile, Integration } from "@/types";

export const DUMMY_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    user_id: "user-1",
    title: "Linear Design Philosophy",
    description: "Deep dive into the aesthetics, speed, keyboard navigation, and engineering systems behind Linear App.",
    is_pinned: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    topics_count: 3
  },
  {
    id: "ws-2",
    user_id: "user-1",
    title: "Next.js 15 & React Server Components",
    description: "Researching async cookies, Server Actions, React Compiler, caching models, and streaming performance.",
    is_pinned: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    topics_count: 2
  },
  {
    id: "ws-3",
    user_id: "user-1",
    title: "SaaS Marketing & Brand Engineering",
    description: "Creating guidelines, visual hooks, landing page scripts, and community-led growth strategies.",
    is_pinned: false,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    topics_count: 1
  }
];

export const DUMMY_TOPICS: ResearchTopic[] = [
  // Topics for Linear Design Philosophy (ws-1)
  {
    id: "topic-1-1",
    workspace_id: "ws-1",
    title: "Keyboard Shortcuts & Command Menus",
    description: "An analysis of command palettes, fuzzy matching, dynamic indexing, and keyboard accessibility.",
    status: "in_progress",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    references_count: 4,
    notes_count: 2
  },
  {
    id: "topic-1-2",
    workspace_id: "ws-1",
    title: "Sleek Dark Mode Color Palettes",
    description: "How Linear structures dark themes using subtle borders, custom shadows, and low-saturation backgrounds.",
    status: "completed",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    references_count: 3,
    notes_count: 1
  },
  {
    id: "topic-1-3",
    workspace_id: "ws-1",
    title: "Linear Sync Engine",
    description: "Technical study of local-first database sync, conflict-free replicated data types (CRDTs), and IndexDB.",
    status: "draft",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    references_count: 0,
    notes_count: 0
  },
  
  // Topics for Next.js 15 (ws-2)
  {
    id: "topic-2-1",
    workspace_id: "ws-2",
    title: "React 19 Server Actions & Transitions",
    description: "Analyzing standard forms, useActionState, useOptimistic, and boundary error handling.",
    status: "in_progress",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    references_count: 5,
    notes_count: 3
  }
];

export const DUMMY_REFERENCES: Reference[] = [
  {
    id: "ref-1",
    topic_id: "topic-1-1",
    title: "How we built the command menu - Linear Blog",
    url: "https://linear.app/blog/rethinking-keyboard-navigation",
    type: "link",
    summary: "Linear's detail on how they designed their command palette. They index all available actions locally, use fuzzy scoring algorithms, and handle focus trap boundaries in DOM strictly.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ref-2",
    topic_id: "topic-1-1",
    title: "Raycast-like command menu in React tutorial",
    url: "https://youtube.com/watch?v=cmdk-react-menu",
    type: "youtube",
    summary: "A practical video tutorial demonstrating custom CMD+K menus using cmdk package. Recommends virtualizing lists for DOM nodes over 100 entries.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ref-3",
    topic_id: "topic-1-1",
    title: "Keyboard navigation accessibility standards (WAI-ARIA)",
    url: "https://w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    type: "link",
    summary: "Official W3C specs for modal focus management. Explains that Escape must close the dialog, and focus must return to the trigger element.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DUMMY_NOTES: ResearchNote[] = [
  {
    id: "note-1",
    topic_id: "topic-1-1",
    title: "Command Menu Best Practices & Architecture",
    content: "## Architectural Goals\n1. **Zero-latency rendering**: The command palette must show up instantly (< 16ms, or within 1 frame).\n2. **Local cache first**: Fetch list of tools/actions during app startup and store locally.\n3. **Keyboard priority**: Arrow keys navigate, Enter triggers, Escape dismisses. Restrict tab key propagation to avoid focus escaping the layout container.\n\n## UX Takeaways from Raycast and Linear\n- Linear uses simple borders `border-[rgba(255,255,255,0.06)]` and cards with `#171717` to frame command items.\n- Raycast shows quick action hints on the bottom right (e.g. 'Press ↵ to Open').\n- Avoid using shadows on menu items; use background highlights instead.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DUMMY_SCRIPTS: GeneratedScript[] = [
  {
    id: "script-1",
    topic_id: "topic-1-1",
    title: "Designing Command Menus - Video Script Draft",
    outline: {
      "hook": "Why do some developer tools feel faster than light, while others feel bloated? It's all about the command palette.",
      "section_1": "Section 1: The Raycast Paradigm. Explain the keyboard-first interface and action registry.",
      "section_2": "Section 2: The Technical Implementation. Focus trap, fuzzy matching, and local state management.",
      "outro": "Summary of best practices and CTA to subscribe."
    },
    script_content: "# Video Script: How to build a command palette users fall in love with\n\n**Visual**: screen recording of Cursor or Linear opening their cmd+k command menus.\n\n**Voiceover**: \"The command menu is the dashboard of the modern developer workspace. If a developer has to reach for their mouse to trigger an action, they've lost their flow state. Today, we're studying the exact design decisions Vercel, Linear, and Raycast made to keep developers in the zone.\"\n\n**Visual**: Diagram showing the action router and local fuzzy indexing.\n\n**Voiceover**: \"Rule number one: Local execution. Your menu should never make network calls on keypresses. Fetch and cache the actions beforehand. Let's look at the schema of a typical registry.\"",
    status: "draft",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const DUMMY_BRAND_PROFILE: BrandProfile = {
  id: "brand-1",
  user_id: "user-1",
  name: "Tech Architect Voice",
  voice_description: "Professional, dense, direct, highly technical, and calm. Explains complex concepts with zero fluff. Similar to Vercel blogs or Stripe documentations.",
  guidelines: "- Never use exclamation marks.\n- Avoid generic buzzwords (e.g. 'game changer', 'leverage').\n- Focus on architecture, trade-offs, and performance metrics first.\n- Keep sentences short, informative, and clear.",
  is_active: true,
  created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
};

export const DUMMY_INTEGRATIONS: Integration[] = [
  {
    id: "int-1",
    user_id: "user-1",
    platform: "youtube",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "int-2",
    user_id: "user-1",
    platform: "notion",
    active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
