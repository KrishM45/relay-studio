"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/40 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "h-13 bg-[#090909]/75 backdrop-blur-md border-border/80 shadow-md shadow-black/10" 
          : "h-16 bg-[#090909]"
      )}
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
            R
          </div>
          <span className="font-bold tracking-tight text-sm text-foreground">
            RELAY STUDIO
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors font-medium">Pricing</a>
          <a href="#docs" className="hover:text-foreground transition-colors">Documentation</a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" className="h-8 text-xs font-semibold hover:bg-accent/15">
              Login
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
