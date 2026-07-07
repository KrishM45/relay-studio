import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center select-none">
      <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center rounded text-primary mb-6">
        <EyeOff className="w-5 h-5" />
      </div>
      <h1 className="text-3xl font-black tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
        The research canvas or document you are trying to access does not exist or has been relocated to another workspace.
      </p>
      <Link href="/dashboard" className="mt-8">
        <Button className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
