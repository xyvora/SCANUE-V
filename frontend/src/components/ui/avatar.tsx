"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/ui";

interface AvatarProps {
  children: ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div className={cn("relative flex items-center justify-center backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 border border-white/10 dark:border-gray-700/10 rounded-full shadow-sm", className)}>
      {children}
    </div>
  );
}

interface AvatarFallbackProps {
  children: ReactNode;
  className?: string;
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
      {children}
    </div>
  );
}
