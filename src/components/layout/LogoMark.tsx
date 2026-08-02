import { cn } from '@/lib/utils/cn';

/**
 * The "B" badge — brand monogram on the same navy gradient used by the
 * app icon/favicon, so the in-app mark and the icon read as one logo.
 *
 * Uses a plain <img> with an `x`-descriptor srcset carrying exact
 * pixel-matched assets for 1x/2x/3x, rather than one large source
 * scaled at render time. Chromium reliably corrupts this specific
 * monogram to a cropped sliver whenever it has to *downscale* it at
 * these small badge sizes (reproduced with next/image `fill`, plain
 * `object-fit`, and CSS transforms alike — verified across device
 * pixel ratios); giving the browser an exact pixel match for its own
 * ratio means it never has to scale at all.
 */
const SIZES = { sm: 28, md: 36, lg: 44 } as const;

export function LogoMark({ size = 'md', className }: { size?: keyof typeof SIZES; className?: string }) {
  const px = SIZES[size];

  return (
    <div
      className={cn('shrink-0 overflow-hidden rounded-[22%] bg-gradient-to-br from-green-2 to-navy', className)}
      style={{ width: px, height: px }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icons/logo-mark-${px}.png`}
        srcSet={`/icons/logo-mark-${px}.png 1x, /icons/logo-mark-${px * 2}.png 2x, /icons/logo-mark-${px * 3}.png 3x`}
        alt=""
        width={px}
        height={px}
        style={{ width: px, height: px }}
      />
    </div>
  );
}
