import Link from 'next/link'
import { GradientButton } from '@/components/ui/gradient-button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
        404 - Page Not Found
      </h2>
      <p className="mb-8 text-xl text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <GradientButton>
          Return Home
        </GradientButton>
      </Link>
    </div>
  )
} 