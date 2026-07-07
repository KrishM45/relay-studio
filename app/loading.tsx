import { Layers } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-screen h-screen bg-background flex flex-col items-center justify-center text-foreground gap-2">
      <Layers className="w-7 h-7 text-primary animate-pulse" />
      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
        Relay Studio Loading...
      </span>
    </div>
  );
}
