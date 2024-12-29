'use client'

// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { Bot, ArrowRight } from 'lucide-react'
// import { WavyBackground } from '../components/ui/wavy-background'

/*const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
}*/

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-black">
      {/*<WavyBackground className="max-w-4xl mx-auto pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8 relative z-10"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-white">
            Welcome to SCANUE-V
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power of AI with our advanced chat interface. Choose between different agent types and get the assistance you need.
          </motion.p>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/chat"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Chatting
              <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </WavyBackground>*/}
    </main>
  )
}
