"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Chrome, Compass, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  function handleMockLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    // Set mock authentication cookie
    document.cookie = "relay-studio-mock-auth=true; path=/; max-age=86400;";
    
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  }

  function handleSocialLogin(provider: string) {
    setIsLoading(true);
    
    // Bypass authentication setting cookie
    document.cookie = "relay-studio-mock-auth=true; path=/; max-age=86400;";
    
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[380px] bg-card border border-border rounded-[var(--radius)] p-7 relative z-10 shadow-sm"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-sm mb-3">
            R
          </div>
          <h1 className="text-base font-bold text-foreground">Sign in to Relay Studio</h1>
          <p className="text-[11px] text-muted-foreground mt-1">
            Research once. Create everywhere.
          </p>
        </div>

        {/* Auth Forms */}
        <div className="space-y-4">
          <form onSubmit={handleMockLogin} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs bg-muted border-border focus:border-primary text-foreground"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-9 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1.5"
              disabled={isLoading}
            >
              <Mail className="w-3.5 h-3.5" />
              {isLoading ? "Signing in..." : "Continue with Magic Link"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/80"></div>
            <span className="flex-shrink mx-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-border/80"></div>
          </div>

          {/* Social Auth Providers */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              className="h-9 text-xs font-semibold border border-border hover:bg-accent/15 flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <Chrome className="w-3.5 h-3.5 text-foreground" />
              <span>Google</span>
            </Button>
            <Button
              variant="ghost"
              className="h-9 text-xs font-semibold border border-border hover:bg-accent/15 flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              <Github className="w-3.5 h-3.5 text-foreground" />
              <span>GitHub</span>
            </Button>
          </div>

          {/* Bypass Note for Investors/Reviewers */}
          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-[10px] text-muted-foreground leading-normal">
              <span className="text-primary font-bold">Evaluation Mode:</span> Clicking any sign-in option automatically log in using mock local storage.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
