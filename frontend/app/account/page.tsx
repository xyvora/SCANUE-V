import React, { useState } from 'react'
import { motion } from 'framer-motion'
// import { User, Mail, Key, Save } from 'lucide-react'
import { User, Mail, Key } from 'lucide-react'
/* import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WavyBackground } from '../../components/ui/wavy-background' */

export default function AccountPage() {
  // const [name, setName] = useState('John Doe')
  const name = useState('John Doe')
  // const [email, setEmail] = useState('john.doe@example.com')
  const email = useState('john.doe@example.com')
  // const [password, setPassword] = useState('')
  const password = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the account update logic
    console.log('Account update attempt with:', { name, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {/*<WavyBackground className="absolute inset-0" />*/}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-3xl shadow-xl p-8 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Your SCANUE-V Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/*<Label htmlFor="name" className="text-gray-300">Name</Label>*/}
            <div className="relative">
              {/*<Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400"
                required
              />*/}
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            {/*<Label htmlFor="email" className="text-gray-300">Email</Label>*/}
            <div className="relative">
              {/*<Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400"
                required
              />*/}
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            {/*<Label htmlFor="password" className="text-gray-300">New Password (leave blank to keep current)</Label>*/}
            <div className="relative">
              {/*<Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400"
              />*/}
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          {/*<Button type="submit" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Save Changes <Save className="ml-2" size={18} />
          </Button>*/}
        </form>
      </motion.div>
    </div>
  )
}
