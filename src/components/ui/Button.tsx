import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-green text-white hover:bg-green-2',
  secondary: 'bg-white text-charcoal border border-border hover:border-green hover:text-green',
  outline: 'bg-transparent text-green border-[1.5px] border-green hover:bg-green-3',
  ghost: 'bg-transparent text-charcoal hover:bg-black/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES: Record<string, string> = {
  sm: 'text-sm px-4 py-2 rounded-lg',
  md: 'text-[15px] px-6 py-3 rounded-lg',
  lg: 'text-base px-7 py-3.5 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
