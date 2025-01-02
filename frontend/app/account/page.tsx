'use client'

import { GradientButton } from "@/components/ui/gradient-button"
import { User } from "lucide-react"
import { WavyBackground } from "@/components/ui/wavy-background"

export default function AccountPage() {
  return (
    <WavyBackground
      className="relative"
      colors={['#c084fc', '#38bdf8', '#818cf8']}
      waveOpacity={0.25}
      blur={12}
    >
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl p-8 space-y-8 text-center bg-white/80 shadow-xl backdrop-blur-sm rounded-3xl sm:p-12">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent sm:text-5xl bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text">
            Your Account
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Manage your SCANUEV account settings and preferences
          </p>

          <div className="flex justify-center gap-4">
            <GradientButton>
              Update Profile
            </GradientButton>
            <GradientButton className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              Sign Out
            </GradientButton>
          </div>
        </div>
      </main>
    </WavyBackground>
  )
}
