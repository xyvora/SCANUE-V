import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-12 w-[200px] mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-8 w-full max-w-md" />
      </div>
    </div>
  )
} 