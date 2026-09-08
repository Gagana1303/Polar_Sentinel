import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'polar' | 'ice' | 'warning' | 'critical' | 'success' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors';
  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  const variants = {
    default: 'bg-[#F0F4F2] dark:bg-[#1A2420] text-[#6B7773] dark:text-[#A6B1AD]',
    polar: 'bg-[#E6F3F0] dark:bg-[#122A25] text-[#087F6B] dark:text-[#62C7B5] font-semibold',
    ice: 'bg-[#EDF7fa] dark:bg-[#10242B] text-[#0284C7] dark:text-[#7DD3FC]',
    warning: 'bg-[#FDF6E9] dark:bg-[#282012] text-[#D99A25] dark:text-[#FCD34D] font-semibold',
    critical: 'bg-[#FDF0F2] dark:bg-[#2A1417] text-[#C94A5A] dark:text-[#FCA5A5] font-semibold',
    success: 'bg-[#EDF7F3] dark:bg-[#112920] text-[#258A68] dark:text-[#6EE7B7] font-semibold',
    outline: 'border border-[#E2E8E5] dark:border-[#222A27] text-[#6B7773] dark:text-[#A6B1AD]',
  };

  const dotColors = {
    default: 'bg-[#9AA5A1]',
    polar: 'bg-[#087F6B] dark:bg-[#62C7B5]',
    ice: 'bg-[#0284C7]',
    warning: 'bg-[#D99A25]',
    critical: 'bg-[#C94A5A]',
    success: 'bg-[#258A68]',
    outline: 'bg-[#6B7773]',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
