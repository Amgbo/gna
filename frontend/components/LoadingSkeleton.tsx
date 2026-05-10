interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-muted ${className}`}
      aria-hidden="true"
    />
  );
}

function HostelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-4 p-4">
        {/* Title and description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function HostelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <HostelCardSkeleton key={i} />
      ))}
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Content Grid */}
      <HostelGridSkeleton count={6} />
    </div>
  );
}

export {
  Skeleton,
  HostelCardSkeleton,
  HostelGridSkeleton,
  TableRowSkeleton,
  PageSkeleton
};
