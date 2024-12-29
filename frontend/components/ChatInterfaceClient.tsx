import React, { useState, useRef, useEffect, useCallback } from 'react'
// import { Send, Bot, User, Upload, ChevronDown, ArrowDown, Heart, Star, AlertTriangle, BarChart } from 'lucide-react'
import { Send, Bot, User, Upload, ArrowDown, Heart, Star, AlertTriangle, BarChart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentResponse } from './AgentResponse'
import { Brain, History } from 'lucide-react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { RefreshButton } from './RefreshButton';
// import { ScrollToBottomButton } from './ScrollToBottomButton';
import DOMPurify from 'dompurify'
// import VoiceInput from './VoiceInput';
/* import { AgentRadarChart } from './AgentRadarChart';
import { AgentHeatmap } from './AgentHeatmap';
import { AgentForceGraph } from './AgentForceGraph';*/
// import { NetworkGraph } from './NetworkGraph';
// import { Heatmap } from './Heatmap';

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  feedback?: {
    type: 'positive' | 'negative'
    comment?: string
  }
  agentResponses?: {
    DLPFC: string
    VMPFC: string
    OFC: string
    ACC: string
    MPFC: string
  }
  showAgentResponses?: boolean
  agentScores?: { agent: string; value: number }[];
}

type AgentType = 'PFC' | 'General'

export const agentConfig = {
  DLPFC: { gradient: 'from-indigo-500 to-blue-600', icon: Brain, label: 'Task Delegation' },
  VMPFC: { gradient: 'from-purple-500 to-indigo-600', icon: Heart, label: 'Emotional Regulation' },
  OFC: { gradient: 'from-blue-500 to-purple-600', icon: Star, label: 'Reward Processing' },
  ACC: { gradient: 'from-violet-500 to-indigo-600', icon: AlertTriangle, label: 'Conflict Detection' },
  MPFC: { gradient: 'from-fuchsia-500 to-purple-600', icon: BarChart, label: 'Value Assessment' },
}

export function ChatInterfaceClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [agentType, setAgentType] = useState<AgentType>('General')
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasScrolledUp, setHasScrolledUp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  // const [isFocusMode, setIsFocusMode] = useState(false);
  const [visualizationType, setVisualizationType] = useState<'radar' | 'heatmap' | 'force'>('radar');

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: `Hello! I'm the ${agentType} agent. How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      }
    ])
  }, [agentType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    const sanitizedInput = DOMPurify.sanitize(input)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: sanitizedInput,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    setIsTyping(true)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated ${agentType} agent response.`,
        isUser: false,
        timestamp: new Date(),
        showAgentResponses: false
      }
      if (agentType === 'PFC') {
        aiMessage.agentResponses = {
          DLPFC: `DLPFC agent response for: ${sanitizedInput}`,
          VMPFC: `VMPFC agent response for: ${sanitizedInput}`,
          OFC: `OFC agent response for: ${sanitizedInput}`,
          ACC: `ACC agent response for: ${sanitizedInput}`,
          MPFC: `MPFC agent response for: ${sanitizedInput}`,
        }
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const handleAgentChange = (type: AgentType) => {
    setAgentType(type)
    setMessages([])
    setIsAgentMenuOpen(false)
  }

  const handleFeedback = (messageId: string, feedbackType: 'positive' | 'negative') => {
    setActiveFeedback(messageId)
    setMessages(prev => prev.map(message =>
      message.id === messageId ? { ...message, feedback: { type: feedbackType } } : message
    ))
  }

  const handleFeedbackComment = (messageId: string) => {
    setMessages(prev => prev.map(message =>
      message.id === messageId ? { ...message, feedback: { ...message.feedback, comment: feedbackComment } } : message
    ))
    setActiveFeedback(null)
    setFeedbackComment('')
    console.log(`Feedback for message ${messageId}: ${messages.find(m => m.id === messageId)?.feedback?.type}, Comment: ${feedbackComment}`)
  }

  /*const toggleAgentResponses = (messageId: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId && message.agentResponses) {
        const showResponses = !message.showAgentResponses;
        return {
          ...message,
          showAgentResponses: showResponses,
          agentScores: showResponses ? calculateAgentScores(message.agentResponses) : undefined
        };
      }
      return message;
    }));
  };*/

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    //setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
    setHasScrolledUp(scrollTop < scrollHeight - clientHeight - 10);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupMessages = (messages: Message[]) => {
    return messages.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup[0].isUser === message.isUser) {
        lastGroup.push(message);
      } else {
        groups.push([message]);
      }
      return groups;
    }, [] as Message[][]);
  };

  const messageGroups = groupMessages(messages);

  const handleRefresh = async () => {
    // Simulate a refresh action
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsTyping(false)
    // You can add actual refresh logic here, like fetching new messages
  }

  const restoreHistory = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      setMessages(messages.slice(0, messageIndex + 1));
      setIsHistoryOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // setIsFocusMode(false);
      inputRef.current?.blur();
    } else if (e.key === '/') {
      e.preventDefault();
      // setIsFocusMode(true);
      inputRef.current?.focus();
    }
  };

  /* const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };*/

  /*const calculateAgentScores = (responses: Record<string, string>) => {
    return Object.entries().map((agent) => (responses).map(([agent, response]) => ({
      agent,
      value: Math.floor(Math.random() * 100) // Replace this with actual score calculation logic
    }));
  };*/

  const handleVisualizationChange = (type: 'radar' | 'heatmap' | 'force') => {
    setVisualizationType(type);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-900 text-white transition-colors duration-300 overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <RefreshButton onRefresh={handleRefresh} />
        <motion.nav
          className="bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-300 rounded-b-2xl backdrop-blur-md bg-opacity-80 sticky top-0 z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">SCANUE-V Chat</h1>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAgentMenuOpen(true)}
              className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-200"
              aria-label="Select agent"
            >
              <Brain className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-200"
              aria-label="View history"
            >
              <History className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.nav>
        <div
          className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-700 hover:scrollbar-thumb-purple-300 scrollbar-rounded"
          onScroll={handleScroll}
        >
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={`flex flex-col ${group[0].isUser ? 'items-end' : 'items-start'} w-full`}>
              {group.map((message, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} ${messageIndex !== 0 ? 'mt-1' : 'mt-2 sm:mt-4'} w-full`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xl ${
                      message.isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}
                  >
                    {messageIndex === 0 && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${message.isUser ? 'from-blue-500 to-purple-600' : 'from-purple-500 to-indigo-600'} shadow-md`}>
                        {message.isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`p-2 sm:p-3 rounded-2xl ${
                          message.isUser
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                        } shadow-md transition-all duration-300 hover:shadow-lg backdrop-blur-md bg-opacity-90 max-w-[85%] sm:max-w-[75%] break-words ${
                          messageIndex === 0 ? 'rounded-t-2xl' : ''
                        } ${
                          messageIndex === group.length - 1 ? 'rounded-b-2xl' : ''
                        }`}
                      >
                        <p className="mb-1 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }} />
                        {messageIndex === group.length - 1 && (
                          <p className={`text-xs ${message.isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      {!message.isUser && agentType === 'PFC' && message.agentResponses && (
                        <div className="mt-2 space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            // onClick={() => toggleAgentResponses(message.id)}
                            className={`w-full p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-indigo-800`}
                          >
                            {message.showAgentResponses ? 'Hide' : 'Show'} Agent Responses
                          </motion.button>
                          <AnimatePresence>
                            {message.showAgentResponses && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-800 rounded-lg p-2"
                              >
                                {message.agentScores && (
                                  <div className="mb-4">
                                    <h4 className="text-lg font-semibold mb-2 text-white">Agent Response Visualization</h4>
                                    <div className="flex justify-center space-x-2 mb-2">
                                      <button
                                        onClick={() => handleVisualizationChange('radar')}
                                        className={`px-2 py-1 rounded ${visualizationType === 'radar' ? 'bg-blue-500' : 'bg-gray-600'}`}
                                      >
                                        Radar
                                      </button>
                                      <button
                                        onClick={() => handleVisualizationChange('heatmap')}
                                        className={`px-2 py-1 rounded ${visualizationType === 'heatmap' ? 'bg-blue-500' : 'bg-gray-600'}`}
                                      >
                                        Heatmap
                                      </button>
                                      <button
                                        onClick={() => handleVisualizationChange('force')}
                                        className={`px-2 py-1 rounded ${visualizationType === 'force' ? 'bg-blue-500' : 'bg-gray-600'}`}
                                      >
                                        Relationships
                                      </button>
                                    </div>
                                    {/*{visualizationType === 'radar' && <AgentRadarChart data={message.agentScores} />}
                                    {visualizationType === 'heatmap' && <AgentHeatmap data={message.agentScores} />}
                                    {visualizationType === 'force' && <AgentForceGraph data={message.agentScores} />}*/}
                                  </div>
                                )}
                                {(Object.keys(message.agentResponses) as Array<keyof typeof message.agentResponses>).map((agent) => (
                                  <AgentResponse key={agent} agent={agent} response={message.agentResponses![agent]} />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      {!message.isUser && messageIndex === group.length - 1 && (
                        <div className="flex flex-col mt-2 space-y-2">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className={`p-1 rounded-full ${message.feedback?.type === 'positive' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-green-600 hover:text-white transition-colors duration-200`}
                              aria-label="Positive feedback"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className={`p-1 rounded-full ${message.feedback?.type === 'negative' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-red-600 hover:text-white transition-colors duration-200`}
                              aria-label="Negative feedback"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </motion.button>
                          </div>
                          {activeFeedback === message.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="Write your feedback here..."
                                className={`flex-1 p-2 text-sm border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleFeedbackComment(message.id)}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                                aria-label="Submit feedback"
                              >
                                <Send className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2 max-w-[80%] sm:max-w-[70%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 shadow-md">
                  <Bot className="w-5 h-5 text-gray-400" />
                </div>
                <div className="bg-gray-700 p-3 rounded-2xl shadow-md backdrop-blur-md bg-opacity-90">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut" }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut", delay: 0.1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut", delay: 0.2 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className={`p-4 bg-gray-800 shadow-lg transition-colors duration-300 rounded-t-2xl backdrop-blur-md bg-opacity-90 sticky bottom-0`}>
          <div className="flex space-x-2 sm:space-x-4 max-w-4xl mx-auto relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => document.getElementById('fileInput')?.click()}
              className={`p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200 flex-shrink-0`}
              aria-label="Upload document"
            >
              <Upload className="w-5 h-5" />
            </motion.button>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
            {/*<VoiceInput onTranscript={handleVoiceInput} />*/}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${agentType} agent... (Press / to focus)`}
              className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
        {/*<ScrollToBottomButton showScrollButton={showScrollButton} scrollToBottom={scrollToBottom} />*/}
      </div>
      <AnimatePresence>
        {hasScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            className="fixed bottom-20 right-4 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Agent Selection Modal */}
      <AnimatePresence>
        {isAgentMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsAgentMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Select Agent</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleAgentChange('PFC')}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                >
                  PFC Agent
                </button>
                <button
                  onClick={() => handleAgentChange('General')}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  General Agent
                </button>
              </div>
              <button
                onClick={() => setIsAgentMenuOpen(false)}
                className="mt-6 w-full p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Chat History</h2>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.button
                    key={message.id}
                    className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 text-left"
                    onClick={() => restoreHistory(message.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="text-sm font-semibold truncate">{message.isUser ? 'You' : 'AI'}</p>
                    <p className="mt-1 text-sm truncate">{message.content}</p>
                    <p className="text-xs text-gray-300 mt-1 truncate">{message.timestamp.toLocaleString()}</p>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="mt-6 w-full p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
