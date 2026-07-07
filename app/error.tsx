"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Workspace boundary error:", error);
  }, [error]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center select-none">
      <div className="w-12 h-12 bg-destructive/10 border border-destructive/20 flex items-center justify-center rounded text-destructive mb-6">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
        An error occurred while rendering this workspace segment. You can try resetting the session.
      </p>
      <div className="flex gap-3 mt-8">
        <Button 
          onClick={() => reset()}
          className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold"
        >
          Reset Session
        </Button>
      </div>
    </div>
  );
}
