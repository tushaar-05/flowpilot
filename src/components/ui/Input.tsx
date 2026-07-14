import { cn } from '@/utils/cn';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react'; //importing the eye icons from lucide-react for password visibility toggle

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
    const isPassword = type === 'password'; //check if the input type is password

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-bold text-ink mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink',
              'placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'transition-all duration-150 shadow-brutal-sm',
              isPassword && 'pr-12',
              error && 'border-danger focus:ring-danger',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}//toggle the password visibility
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {/* change the icon based on the state of showPassword */}
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />} 
              
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm font-semibold text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; 
