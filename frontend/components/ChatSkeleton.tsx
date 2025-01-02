export function ChatSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
      {/* Add more skeleton items */}
    </div>
  )
} 