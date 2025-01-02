'use client'

import { Copy, ThumbsUp } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { Message } from '@/types/chat'

interface MessageContextMenuProps {
  children: React.ReactNode
  message: Message
  onFeedback: (messageId: string, type: 'positive' | 'negative') => void
  onCopy: (content: string) => void
}

export function MessageContextMenu({ children, message, onFeedback, onCopy }: MessageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="glass-card text-white/80">
        <ContextMenuItem
          className="hover:text-white focus:text-white"
          onClick={() => onCopy(message.content)}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Message
        </ContextMenuItem>
        {!message.isUser && (
          <ContextMenuItem
            className="hover:text-white focus:text-white"
            onClick={() => onFeedback(message.id, 'positive')}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Mark as Helpful
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
