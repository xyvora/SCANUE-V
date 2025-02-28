"use client";

import type { AgentType, Message, SubmitEvent } from "@/app/interfaces/chat";
import { BrainCircuit, Globe2, Menu, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatService } from "@/services/ChatService";
import ErrorMessage from "@/components/ErrorMessage";
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
  const [agentType, setAgentType] = useState<AgentType>("PFC");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hi there! I am your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date().toISOString(),
        agentType: agentType,
      },
    ]);
  }, [agentType]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (messages.length > chatServiceRef.current.MAX_MESSAGES) {
      setMessages((prevMessages) => chatServiceRef.current.trimMessages(prevMessages));
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

      document.getElementById("txtChat")?.focus();
    },
    [agentType, input],
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
        <header className="sticky top-0 z-10 flex items-center justify-between p-3 transition-colors duration-300 shadow-md rounded-b-2xl bg-white/50 backdrop-blur-xl dark:bg-gray-900/50 sm:p-4 border-b border-white/20 dark:border-gray-800/30">
          <h1 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">
            SCANUEV Chat
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center lg:hidden">
              {agentType === "PFC" ?
                <span className="flex items-center text-sm font-medium"><BrainCircuit className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" /> PFC</span> :
                <span className="flex items-center text-sm font-medium"><Globe2 className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" /> General</span>
              }
            </div>
            <GradientButton
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </GradientButton>
            <div className="hidden overflow-hidden rounded-lg lg:flex">
              <GradientButton
                variant={agentType === "PFC" ? "default" : "outline"}
                className={`rounded-r-none ${agentType === "PFC" ? "bg-primary text-white" : "bg-transparent"}`}
                onClick={() => handleAgentChange("PFC")}
              >
                <BrainCircuit className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" /> PFC
              </GradientButton>
              <GradientButton
                variant={agentType === "General" ? "default" : "outline"}
                className={`rounded-l-none ${agentType === "General" ? "bg-primary text-white" : "bg-transparent"}`}
                onClick={() => handleAgentChange("General")}
              >
                <Globe2 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> General
              </GradientButton>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ChatContainer messages={messages} onDelete={handleDeleteMessage} />
        </main>
        <div className="fixed bottom-0 left-0 right-0 p-2 border-t border-white/20 dark:border-gray-800/30 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl sm:p-4">
          <div className="w-full px-2 sm:px-4">
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="chat-form">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      name="txtChat"
                      placeholder={`Message ${agentType} agent...`}
                      className={cn(
                        "w-full rounded-lg p-2 pr-10",
                        "border bg-muted/50 focus:border-primary",
                        "placeholder:text-muted-foreground/70",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "text-base sm:text-lg",
                        "h-10 sm:h-12",
                        "transition-colors duration-200",
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
                    className="w-14 h-14 sm:w-16 sm:h-16 transform transition-transform duration-200 hover:scale-110"
                    type="submit"
                    id="chatSubmit"
                  >
                    <Send className="w-6 h-6 sm:h-7 sm:w-7" />
                  </GradientButton>
                </div>
              </div>
            </form>
          </div>
          <ErrorMessage error={error} />
        </div>
      </div>
    </TooltipProvider>
  );
}
