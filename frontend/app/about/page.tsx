import React from 'react'

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        About AI Chat Interface
      </h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        AI Chat Interface is an advanced conversational AI platform that allows users to interact with different types of AI agents. Our platform leverages cutting-edge natural language processing technologies to provide intelligent and context-aware responses.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features:</h2>
      <ul className="list-disc list-inside text-lg">
        <li>Multiple AI agent types (PFC and General)</li>
        <li>Real-time conversation with AI</li>
        <li>Dark mode for comfortable viewing</li>
        <li>Emoji support for expressive communication</li>
        <li>Feedback system for continuous improvement</li>
      </ul>
    </main>
  )
}
