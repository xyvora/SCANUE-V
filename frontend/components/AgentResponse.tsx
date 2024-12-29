import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { agentConfig } from './ChatInterfaceClient'

interface AgentResponseProps {
  agent: string;
  response: string;
}

export function AgentResponse({ agent, response }: AgentResponseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { gradient, icon: Icon, label } = agentConfig[agent]

  return (
    <div className="mb-2">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-200`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span>{agent} - {label}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-3 rounded-b-lg shadow-inner"
          >
            <p className="text-gray-200">{response}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
