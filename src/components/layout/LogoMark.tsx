import { cn } from '@/lib/utils/cn';

/**
 * The "B" badge: bold geometric B (renders in the site's Manrope font),
 * a hidden-checkmark/roofline accent above it, and a gold accent tucked
 * bottom-right. One SVG so every piece scales together at any badge size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] bg-gradient-to-br from-green-2 to-navy',
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          d="M29.9 37.3 L39.3 26.6 L45.0 34.5"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40.7 37.3 L47.1 43.8 L70.1 24.4"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="74.8" cy="78.4" r="6.5" fill="url(#logoGold)" />
        <text
          x="50"
          y="83"
          textAnchor="middle"
          fill="white"
          fontFamily="var(--font-manrope), sans-serif"
          fontWeight="800"
          fontSize="54"
        >
          B
        </text>
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFB627" />
            <stop offset="100%" stopColor="#F5A300" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
