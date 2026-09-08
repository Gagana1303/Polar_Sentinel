import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const configs = {
    low: {
      label: 'LOW RISK',
      bg: 'bg-[#EDF7F3] dark:bg-[#112920] text-[#258A68] dark:text-[#6EE7B7]',
      dot: 'bg-[#258A68] dark:bg-[#6EE7B7]',
    },
    medium: {
      label: 'MEDIUM RISK',
      bg: 'bg-[#FDF6E9] dark:bg-[#282012] text-[#D99A25] dark:text-[#FCD34D]',
      dot: 'bg-[#D99A25] dark:bg-[#FCD34D]',
    },
    high: {
      label: 'HIGH RISK',
      bg: 'bg-[#FDF0F2] dark:bg-[#2A1417] text-[#C94A5A] dark:text-[#FCA5A5]',
      dot: 'bg-[#C94A5A] dark:bg-[#FCA5A5]',
    },
    critical: {
      label: 'CRITICAL RISK',
      bg: 'bg-[#FDF0F2] dark:bg-[#2A1417] text-[#C94A5A] dark:text-[#FCA5A5]',
      dot: 'bg-[#C94A5A] dark:bg-[#FCA5A5]',
    },
  };

  const config = configs[level] || configs.low;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5 font-semibold tracking-wider',
    md: 'px-3 py-1 text-[11px] gap-1.5 font-bold tracking-wider',
    lg: 'px-3.5 py-1.5 text-xs gap-2 font-extrabold tracking-wider',
  };

  return (
    <span className={`inline-flex items-center rounded-full ${config.bg} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
