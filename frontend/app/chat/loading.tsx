import { Bot } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Bot className="w-12 h-12 mb-4 text-blue-500 animate-bounce" />
      <p className="text-lg text-gray-600">Loading chat interface...</p>
    </div>
  )
}
