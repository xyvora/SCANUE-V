import { useEffect, useRef } from "react";
import type { Message } from "@/app/interfaces/chat";

interface UseChatScrollOptions {
  messages: Message[];
  shouldAutoScroll?: boolean;
  threshold?: number;
}

export function useChatScroll({
  messages,
  shouldAutoScroll = true,
  threshold = 100,
}: UseChatScrollOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !shouldAutoScroll) return;

    const shouldScroll =
      scrollElement.scrollHeight -
        scrollElement.scrollTop -
        scrollElement.clientHeight <
      threshold;

    if (shouldScroll) {
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }, [messages, shouldAutoScroll, threshold]);

  useEffect(() => {
    if (shouldAutoScroll) {
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [shouldAutoScroll]);

  return { scrollRef };
}
