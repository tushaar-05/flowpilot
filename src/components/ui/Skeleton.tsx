import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-2xl border-2 border-ink/20 bg-ink/5', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border-2 border-ink bg-surface p-6 shadow-brutal space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
