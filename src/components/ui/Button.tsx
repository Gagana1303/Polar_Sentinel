import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#087F6B]/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2 rounded-2xl font-semibold',
  };

  const variants = {
    primary: 'bg-[#087F6B] hover:bg-[#066454] text-white shadow-subtle',
    secondary: 'bg-[#F0F4F2] dark:bg-[#1A2420] text-[#14201D] dark:text-[#F4F7F5] hover:bg-[#E2E8E5] dark:hover:bg-[#222A27]',
    outline: 'border border-[#E2E8E5] dark:border-[#222A27] text-[#14201D] dark:text-[#F4F7F5] hover:bg-[#F0F4F2] dark:hover:bg-[#1A2420]',
    ghost: 'text-[#6B7773] dark:text-[#A6B1AD] hover:text-[#14201D] dark:hover:text-[#F4F7F5] hover:bg-black/5 dark:hover:bg-white/5',
    danger: 'bg-[#C94A5A] hover:bg-[#B33E4D] text-white shadow-subtle',
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
