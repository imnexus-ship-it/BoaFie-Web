import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { LogoMark } from './LogoMark';

export function Logo({
  href = '/',
  size = 'md',
  light = false,
  showTagline = false,
  className,
}: {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  const badgeSize = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const wordmarkSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark className={badgeSize} />
      <div>
        <span className={cn('font-head font-bold', wordmarkSize, light ? 'text-white' : 'text-green')}>BoaFie</span>
        {showTagline && (
          <p className={cn('-mt-0.5 text-[9px] font-medium uppercase tracking-wider', light ? 'text-white/50' : 'text-muted')}>
            The home where trusted work begins
          </p>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
