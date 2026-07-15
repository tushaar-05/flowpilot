import { cn } from '@/utils/cn';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({ label, options, value, onChange, className }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-surface px-4 py-2.5 text-sm font-bold hover:bg-yellow/20 transition-all shadow-brutal-sm"
      >
        <span className="text-muted">{label}:</span>
        <span className="text-ink">{selected?.label ?? 'All'}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-2 min-w-[200px] rounded-2xl border-2 border-ink bg-surface py-2 shadow-brutal">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-yellow/20 transition-colors"
            >
              {option.label}
              {value === option.value && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
