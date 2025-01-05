'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

const SKELETON_ITEMS = [
  { id: 'skeleton-1', width: '250px', delay: 0 },
  { id: 'skeleton-2', width: '200px', delay: 0.1 },
  { id: 'skeleton-3', width: '300px', delay: 0.2 },
] as const;

export default function ChatLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen p-4 space-y-4"
    >
      <div className="flex-1 space-y-4">
        {SKELETON_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className="flex items-start space-x-4"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className={`h-4 w-[${item.width}]`} />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
