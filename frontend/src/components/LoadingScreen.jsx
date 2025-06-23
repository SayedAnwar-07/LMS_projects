import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />

        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
          <Skeleton className="h-4 w-4 rounded-full animate-pulse delay-100" />
          <Skeleton className="h-4 w-4 rounded-full animate-pulse delay-200" />
        </div>

        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
