import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'yellow' | 'dark' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

const variants = {
  primary: 'bg-primary text-white border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active hover:bg-primary-dark',
  secondary: 'bg-secondary text-white border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active',
  yellow: 'bg-yellow text-ink border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active',
  dark: 'bg-ink text-white border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active',
  outline: 'bg-surface text-ink border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active hover:bg-background',
  ghost: 'text-muted border-transparent hover:bg-yellow/20 hover:text-ink',
  danger: 'bg-danger text-white border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active',
  accent: 'bg-accent text-white border-ink shadow-brutal-sm shadow-brutal-hover shadow-brutal-active',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm font-bold',
  lg: 'px-7 py-3.5 text-base font-bold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border-2 font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
