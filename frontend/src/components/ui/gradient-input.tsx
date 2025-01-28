import * as React from "react";
import { cn } from "@/lib/utils";

const GradientInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-blue-300/30 bg-white/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-blue-300/70 focus:outline-hidden focus:visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-xs transition-all duration-200",
      className,
    )}
    ref={ref}
    {...props}
  />
));
GradientInput.displayName = "GradientInput";

export { GradientInput };
