"use client";

import { useState } from 'react';
import { Brain, Globe, Send } from 'lucide-react';
import { cn } from '@/utils/ui';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type AgentType = 'PFC' | 'General';

export default function ChatPage() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentType, setAgentType] = useState<AgentType>('General');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic, 
          agent: agentType 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response || 'No response received');
      } else {
        setResponse(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden text-gray-800 bg-gradient-to-br from-blue-100 to-purple-200"
      data-testid="chat-page"
    >
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 transition-colors duration-300 shadow-md rounded-b-2xl bg-white/70 backdrop-blur-md sm:p-4">
        <h1 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">
          SCANUEV Chat
        </h1>
        <div className="hidden overflow-hidden rounded-lg lg:flex">
          <Button
            variant={agentType === "PFC" ? "gradient" : "secondary"}
            onClick={() => setAgentType("PFC")}
            className="rounded-r-none"
          >
            <Brain className="w-5 h-5 mr-2" /> PFC
          </Button>
          <Button
            variant={agentType === "General" ? "gradient" : "secondary"}
            onClick={() => setAgentType("General")}
            className="rounded-l-none"
          >
            <Globe className="w-5 h-5 mr-2" /> General
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="chat-form">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={`Enter topic for ${agentType} agent...`}
                    className={cn(
                      "w-full rounded-lg p-2 pr-10",
                      "border bg-white/50 focus:border-blue-500",
                      "placeholder:text-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-blue-300",
                      "text-base sm:text-lg",
                      "min-h-[100px] resize-y"
                    )}
                    disabled={isLoading}
                    aria-label={`Topic for ${agentType} agent`}
                  />
                  {isLoading && (
                    <div className="absolute -translate-y-1/2 right-3 top-1/2">
                      <LoadingSpinner size={20} />
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                data-testid="chat-submit"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-10 w-10 sm:h-12 sm:w-12",
                  "rounded-full",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-200",
                )}
                disabled={isLoading || !topic.trim()}
              >
                <Send className="w-5 h-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </form>

          {response && (
            <div 
              className="w-full p-4 rounded-lg shadow-md bg-white/70 backdrop-blur-md"
              data-testid="chat-response"
            >
              <h2 className="text-lg font-semibold mb-2">Response:</h2>
              <p className="text-base">{response}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
