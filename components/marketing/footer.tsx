"use client";

import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card/20 py-8 px-4 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px]">
            R
          </div>
          <span className="font-bold text-foreground tracking-tight text-[11px]">
            RELAY STUDIO
          </span>
          <span className="text-[10px]">© {new Date().getFullYear()} Root Access Inc.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
