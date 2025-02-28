"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BotAvatar } from "@/components/BotAvatar";
import type { Message } from "@/app/interfaces/chat";
import { MessageActions } from "@/components/MessageActions";
import { UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/date-utils";
import { memo } from "react";

interface ChatMessageProps {
  message: Message;
  isPartOfGroup: boolean;
  showTimestamp: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}

function ChatMessageComponent({
  message,
  isPartOfGroup,
  showTimestamp,
  onDelete,
  className,
}: ChatMessageProps) {
  const isUser = message.isUser;
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const messageBgClass = isUser
    ? "bg-blue-500/80 backdrop-blur-sm text-white shadow-blue-500/20 shadow-md border border-blue-400/30"
    : "bg-gray-200/70 backdrop-blur-sm dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 shadow-gray-300/20 dark:shadow-gray-900/20 shadow-md border border-gray-300/30 dark:border-gray-700/30";

  return (
    <li
      className={cn(
        "flex items-end gap-2",
        alignmentClass,
        isPartOfGroup ? "mt-1" : "mt-4",
        className,
      )}
      aria-label={`Message from ${isUser ? "You" : "Assistant"}`}
    >
      {!isUser && (
        <Avatar className="shrink-0 w-8 h-8 sm:h-10 sm:w-10 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30">
          <AvatarFallback>
            <BotAvatar agentType={message.agentType} />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "group relative",
          "max-w-[75%] break-words sm:max-w-[70%]",
          "rounded-2xl p-3",
          messageBgClass,
          "transition-all duration-200",
        )}
      >
        <p className="text-sm whitespace-pre-wrap sm:text-base">{message.content}</p>
        {showTimestamp && (
          <time
            dateTime={message.timestamp}
            className="absolute bottom-0 right-0 -mb-5 text-xs text-gray-500 transition-opacity opacity-0 group-hover:opacity-100"
          >
            {formatMessageTime(message.timestamp)}
          </time>
        )}
        <div className="absolute transition-opacity opacity-0 right-2 top-2 group-hover:opacity-100">
          <MessageActions message={message} onDelete={onDelete} />
        </div>
      </div>
      {isUser && (
        <Avatar className="shrink-0 w-8 h-8 sm:h-10 sm:w-10 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30">
          <AvatarFallback>
            <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </AvatarFallback>
        </Avatar>
      )}
    </li>
  );
}

export const ChatMessage = memo(ChatMessageComponent);
