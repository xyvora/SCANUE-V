import React, { useState } from "react";
import { motion } from "framer-motion";
// import { User, Lock, ArrowRight } from 'lucide-react'
import { User, Lock } from "lucide-react";
import Link from "next/link";
/* import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WavyBackground } from '../../components/ui/wavy-background' */

export default function LoginPage() {
  // const [email, setEmail] = useState('')
  const email = useState("");
  // const [password, setPassword] = useState('')
  const password = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      {/*<WavyBackground className="absolute inset-0" />*/}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-gray-800 bg-opacity-80 p-8 shadow-xl backdrop-blur-md"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Login to SCANUE-V</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/*<Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400"
              required
            />*/}
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-300"
              size={18}
            />
          </div>
          <div className="relative">
            {/*<Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400"
              required
            />*/}
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-300"
              size={18}
            />
          </div>
          {/* <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Login <ArrowRight className="ml-2" size={18} />
          </Button> */}
        </form>
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
