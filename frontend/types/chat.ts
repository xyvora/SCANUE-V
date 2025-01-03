export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  agentResponse?: string;
  feedback?: {
    type: "positive" | "negative";
    comment: string;
  };
}

export type AgentType = "General" | "PFC";
