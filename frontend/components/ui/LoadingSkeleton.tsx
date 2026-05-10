import type React from "react";

type LoadingSkeletonProps = {
  className?: string;
  lines?: number;
};

export default function LoadingSkeleton({
  className = "",
  lines = 3
}: LoadingSkeletonProps) {
  return (
    <div className={"animate-pulse space-y-4 " + className}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="soft-card rounded-[24px] h-32 p-6" />
      ))}
    </div>
  );
}

