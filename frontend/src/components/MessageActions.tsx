"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/app/interfaces/chat";
import { cn } from "@/utils/ui";
import { memo } from "react";

interface MessageActionsProps {
  message: Message;
  onDelete?: (id: string) => void;
}

function MessageActionsComponent({ message, onDelete }: MessageActionsProps) {
  if (!onDelete) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDelete(message.id);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            "rounded-full",
            "bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm",
            "hover:bg-gray-200/50 dark:hover:bg-gray-700/50",
            "focus-visible:ring-2 focus-visible:ring-primary",
            "transition-colors duration-200",
            "border border-white/20 dark:border-gray-700/20",
          )}
          aria-label="Message actions"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={8}
        className={cn(
          "w-48",
          "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md",
          "border border-gray-200/30 dark:border-gray-700/30",
          "shadow-lg",
          "animate-in fade-in-0 zoom-in-95",
          "duration-200",
        )}
      >
        <DropdownMenuItem
          className={cn(
            "flex items-center gap-2",
            "text-red-600 dark:text-red-400",
            "focus:text-red-600 dark:focus:text-red-400",
            "cursor-pointer",
            "hover:bg-red-50/50 dark:hover:bg-red-900/20",
          )}
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const MessageActions = memo(MessageActionsComponent);
