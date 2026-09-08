import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'elevated' | 'borderless';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}) => {
  const base = 'rounded-3xl transition-all duration-200';

  const variants = {
    default: 'polar-card',
    flat: 'bg-[#F0F4F2] dark:bg-[#141C19]',
    elevated: 'polar-card-elevated',
    borderless: 'bg-[#FFFFFF] dark:bg-[#141C19] shadow-subtle',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hover = hoverable ? 'hover:shadow-subtle-lg hover:border-[#087F6B]/30 cursor-pointer' : '';

  return (
    <div className={`${base} ${variants[variant]} ${paddings[padding]} ${hover} ${className}`} {...props}>
      {children}
    </div>
  );
};
