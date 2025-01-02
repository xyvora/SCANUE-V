import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  const widths = [100, 90, 80] as const

  return (
    <output className="page-enter w-full max-w-4xl mx-auto p-4 space-y-4" aria-label="Loading content" aria-busy="true">
      <Skeleton className="h-8 w-[200px]" aria-hidden="true" />
      <Skeleton className="h-32 w-full" aria-hidden="true" />
      <div className="space-y-2">
        {widths.map((width, i) => (
          <Skeleton
            key={`skeleton-${width}`}
            style={{ width: `${width}%` }}
            className="h-4"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="sr-only">Loading page content...</div>
    </output>
  )
} 