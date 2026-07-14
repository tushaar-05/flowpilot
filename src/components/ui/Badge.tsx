import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'solid';
  color?: 'blue' | 'orange' | 'yellow' | 'emerald' | 'pink' | 'purple';
}

const colorMap = {
  blue: 'bg-primary/25 text-ink',
  orange: 'bg-accent/25 text-ink',
  yellow: 'bg-yellow/40 text-ink',
  emerald: 'bg-secondary/25 text-ink',
  pink: 'bg-pink/25 text-ink',
  purple: 'bg-purple/25 text-ink',
};

export function Badge({ children, className, variant = 'default', color = 'blue' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-2 border-ink px-3 py-0.5 text-xs font-bold uppercase tracking-wide',
        variant === 'outline' && 'bg-surface',
        variant === 'solid' && colorMap[color],
        variant === 'default' && colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
