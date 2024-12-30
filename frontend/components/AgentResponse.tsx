import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { agentConfig } from "./ChatInterfaceClient";

interface AgentResponseProps {
  agent: string;
  response: string;
}

export function AgentResponse({ agent, response }: AgentResponseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { gradient, icon: Icon, label } = agentConfig[agent];

  return (
    <div className="mb-2">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg bg-gradient-to-r p-2 ${gradient} text-white shadow-md transition-all duration-200 hover:shadow-lg`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>
            {agent} - {label}
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-b-lg bg-gray-800 p-3 shadow-inner"
          >
            <p className="text-gray-200">{response}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
