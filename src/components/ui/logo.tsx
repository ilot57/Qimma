import Image from 'next/image';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

const sizeMap = {
  sm: 80,
  md: 100,
  lg: 120,
  xl: 160,
};

const iconSizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function Logo({ className, size = 'md', iconOnly = false }: LogoProps) {
  const logoSize = iconOnly ? iconSizeMap[size] : sizeMap[size];
  const logoSrc = iconOnly ? '/qimma-icon.svg' : '/qimma-logo.svg';

  return (
    <div className={cn('flex items-center', className)}>
      <Image
        src={logoSrc}
        alt="Qimma AI Logo"
        width={logoSize}
        height={logoSize}
        className="flex-shrink-0"
      />
    </div>
  );
}
