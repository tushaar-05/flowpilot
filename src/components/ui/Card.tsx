import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  color?: 'white' | 'yellow' | 'blue' | 'pink' | 'emerald';
}

const paddingMap = {
  none: '',
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
};

const colorMap = {
  white: 'bg-surface',
  yellow: 'bg-yellow/20',
  blue: 'bg-primary/10',
  pink: 'bg-pink/15',
  emerald: 'bg-secondary/15',
};

export function Card({ children, className, padding = 'md', hover, color = 'white', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border-2 border-ink bg-surface shadow-brutal',
        paddingMap[padding],
        colorMap[color],
        hover && 'shadow-brutal-hover cursor-default transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-5', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-xl font-extrabold text-ink tracking-tight', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-base text-muted mt-1.5 leading-relaxed', className)}>{children}</p>;
}
