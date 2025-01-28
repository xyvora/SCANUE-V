"use client";

import type { AgentType, Message, SubmitEvent } from "@/app/interfaces/chat";
import { Brain, Globe, Menu, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT_CONSTANTS } from "@/constants/chat";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatService } from "@/services/ChatService";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/ui";
import { v4 as uuidv4 } from "uuid";

export function ChatInterfaceClient() {
  const chatService = new ChatService();

  const chatServiceRef = useRef(chatService);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentType, setAgentType] = useState<AgentType>(CHAT_CONSTANTS.DEFAULT_AGENT as AgentType);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hi there! I am your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (messages.length > chatServiceRef.current.MAX_MESSAGES) {
      setMessages((prevMessages) => chatServiceRef.current.trimMessages(prevMessages));
    }
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: SubmitEvent) => {
      e.preventDefault();

      if (!input.trim()) {
        setError("Please enter a message");
        return;
      }

      setIsTyping(true);
      setError(null);

      try {
        const newMessage: Message = {
          id: uuidv4(),
          content: input,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        const response = await chatServiceRef.current.sendMessage(newMessage.content, agentType);
        setMessages((prev) => [...prev, response]);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to send message");
      } finally {
        setIsTyping(false);
      }
    },
    [input, agentType],
  );

  const handleAgentChange = useCallback((type: AgentType) => {
    setAgentType(type);
    setMessages([]);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== messageId));
  }, []);

  return (
    <TooltipProvider>
      <div
        className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100"
        data-testid="chat-interface"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between p-3 transition-colors duration-300 shadow-md rounded-b-2xl bg-white/70 backdrop-blur-md dark:bg-gray-900/70 sm:p-4">
          <h1 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">
            SCANUEV Chat
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <GradientButton
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </GradientButton>
            <div className="hidden overflow-hidden rounded-lg lg:flex">
              <GradientButton
                variant={agentType === "PFC" ? "default" : "outline"}
                className="rounded-r-none"
                onClick={() => handleAgentChange("PFC")}
              >
                <Brain className="w-5 h-5 mr-2" /> PFC
              </GradientButton>
              <GradientButton
                variant={agentType === "General" ? "default" : "outline"}
                className="rounded-l-none"
                onClick={() => handleAgentChange("General")}
              >
                <Globe className="w-5 h-5 mr-2" /> General
              </GradientButton>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ChatContainer messages={messages} onDelete={handleDeleteMessage} />
        </main>
        <div className="fixed bottom-0 left-0 right-0 p-2 border-t bg-background/95 backdrop-blur-xs sm:p-4">
          <div className="w-full px-2 sm:px-4">
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="chat-form">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${agentType} agent...`}
                      className={cn(
                        "w-full rounded-lg p-2 pr-10",
                        "border bg-muted/50 focus:border-primary",
                        "placeholder:text-muted-foreground/70",
                        "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                        "text-base sm:text-lg",
                        "h-10 sm:h-12",
                      )}
                      disabled={isTyping}
                      aria-label={`Message ${agentType} agent`}
                    />
                    {isTyping && (
                      <div className="absolute -translate-y-1/2 right-3 top-1/2">
                        <LoadingSpinner size={20} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <GradientButton
                    className="w-12 h-12 sm:w-14 sm:h-14"
                    type="submit"
                    data-testid="chat-submit"
                  >
                    <Send className="w-5 h-5 sm:h-6 sm:w-6" />
                  </GradientButton>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="h-[60px] sm:h-[72px]" /> {/* Spacer to prevent overlap */}
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </TooltipProvider>
  );
}
