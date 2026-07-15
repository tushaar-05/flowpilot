import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className, onClear }: SearchBarProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-ink bg-surface py-2.5 pl-11 pr-11 text-sm font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-brutal-sm transition-all text-ink"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:bg-yellow/30 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
