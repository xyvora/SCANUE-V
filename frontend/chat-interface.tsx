import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Moon, Sun, Smile } from 'lucide-react'
import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'

interface Message {
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! How can I assist you today?", isUser: false, timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    setMessages(prev => [...prev, { content: input, isUser: true, timestamp: new Date() }])
    setInput('')

    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { content: "This is a simulated AI response.", isUser: false, timestamp: new Date() }])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleEmojiSelect = (emoji: any) => {
    setInput(prev => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} transition-colors duration-300`}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex justify-between items-center transition-colors duration-300`}>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI Chat Interface</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xl ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.isUser ? 'bg-gradient-to-br from-blue-500 to-purple-600' : (darkMode ? 'bg-gray-700' : 'bg-white')
              } shadow-md`}>
                {message.isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-600" />}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : (darkMode ? 'bg-gray-700' : 'bg-white')
                } shadow-md transition-all duration-300 hover:shadow-lg`}
              >
                <p className="mb-1 leading-relaxed">{message.content}</p>
                <p className={`text-xs ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-start space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg shadow-md`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
        <div className="flex space-x-4 max-w-4xl mx-auto relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
            aria-label="Open emoji picker"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className={`flex-1 p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              {/*<Picker data={data} onEmojiSelect={handleEmojiSelect} theme={darkMode ? 'dark' : 'light'} />*/}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
