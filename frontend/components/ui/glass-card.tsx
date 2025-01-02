import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "w-full p-8 space-y-8 text-center rounded-3xl glass-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
