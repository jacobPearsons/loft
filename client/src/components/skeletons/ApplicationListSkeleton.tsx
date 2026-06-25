import { Skeleton } from '@/components/ui/skeleton'

export default function ApplicationListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-2 min-w-0">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
