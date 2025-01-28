import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline";
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium shadow-md transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          variant === "default" && "bg-linear-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg",
          variant === "outline" && "border border-blue-500 bg-transparent text-blue-500 hover:bg-blue-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
GradientButton.displayName = "GradientButton";

export { GradientButton };
