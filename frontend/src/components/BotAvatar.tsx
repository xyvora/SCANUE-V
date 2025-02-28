import { BrainCircuit, Globe2 } from "lucide-react";

interface BotAvatarProps {
  agentType?: "PFC" | "General";
}
export function BotAvatar({ agentType }: BotAvatarProps) {
  const currentAgentType = agentType || "General";

  return (
    <div className="w-full h-full p-1">
      {currentAgentType === "PFC" ? (
        <BrainCircuit className="w-full h-full text-purple-600 dark:text-purple-400" />
      ) : (
        <Globe2 className="w-full h-full text-blue-600 dark:text-blue-400" />
      )}
    </div>
  );
}
