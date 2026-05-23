/**
 * Logo Component
 * 
 * Reusable logo component for the application.
 * Follows frontend-lifecycle: UI Composition - single responsibility component.
 */

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo - Displays the application logo
 * 
 * @param variant - 'full' shows complete logo, 'icon' shows only the icon
 * @param className - Additional CSS classes
 * @param width - Custom width (default: 120 for full, 40 for icon)
 * @param height - Custom height (default: 40 for full, 40 for icon)
 */
export function Logo({ 
  variant = 'full', 
  className = '',
  width,
  height 
}: LogoProps) {
  const defaultWidth = variant === 'full' ? 120 : 40;
  const defaultHeight = variant === 'full' ? 40 : 40;

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${className}`}
      aria-label="Loft Community Home"
    >
      <Image
        src="/logo.png"
        alt="Loft Community Logo"
        width={width || defaultWidth}
        height={height || defaultHeight}
        className="object-contain"
        priority={false}
      />
    </Link>
  );
}

/**
 * LogoWithText - Logo with text next to it
 */
export function LogoWithText({ className = '' }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${className}`}
      aria-label="Loft Community Home"
    >
      <Image
        src="/logo.png"
        alt="Loft Community"
        width={100}
        height={35}
        className="object-contain"
        priority={false}
      />
    </Link>
  );
}

/**
 * LogoIcon - Just the logo icon (smaller)
 */
export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={`flex items-center ${className}`}
      aria-label="Loft Community Home"
    >
      <Image
        src="/logo.png"
        alt="Loft Community"
        width={40}
        height={40}
        className="object-contain"
        priority={false}
      />
    </Link>
  );
}

export default Logo;
