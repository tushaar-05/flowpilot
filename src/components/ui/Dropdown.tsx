import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center">
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full z-20 mt-1 min-w-[160px] rounded-lg border border-border bg-surface py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-ink/5 transition-colors',
                item.danger && 'text-danger'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DropdownButton({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-ink/5">
      {label}
      <ChevronDown className="h-4 w-4 text-muted" />
    </span>
  );
}
