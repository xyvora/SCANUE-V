"use client";

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Content, Item, Root, Trigger } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = Root;
const DropdownMenuTrigger = Trigger;
const DropdownMenuContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Content
    ref={ref}
    className={cn(
      "bg-white/70 dark:bg-gray-800/70 text-popover-foreground z-50 min-w-[8rem] rounded-md border border-white/20 dark:border-gray-700/20 p-1 shadow-md backdrop-blur-md",
      className,
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = Content.displayName;

const DropdownMenuItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent/50 focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = Item.displayName;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
