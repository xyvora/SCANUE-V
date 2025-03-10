  import type { ComponentPropsWithoutRef, ElementRef } from "react";
  import { type VariantProps, cva } from "class-variance-authority";
  import { Root } from "@radix-ui/react-label";
  import { cn } from "@/lib/utils";
  import { forwardRef } from "react";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> &
  VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = Root.displayName;

export { Label };
