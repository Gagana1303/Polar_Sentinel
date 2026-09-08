import React from 'react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  description: string;
  statusBadge?: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon,
  description,
  statusBadge,
  trend,
}) => {
  return (
    <Card padding="sm" className="relative overflow-hidden flex flex-col justify-between hover:border-polar-700/40 transition-all duration-200 shadow-soft hover:shadow-soft-lg">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-2xl bg-polar-50 dark:bg-polar-950/80 text-polar-700 dark:text-polar-300 border border-polar-100 dark:border-polar-800/60 shadow-2xs">
          {icon}
        </div>
        {statusBadge}
      </div>

      <div className="mt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-darkSecondary">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-text-secondary dark:text-text-darkSecondary">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-surface-light-border/60 dark:border-surface-dark-border/60 flex items-center justify-between text-xs text-text-secondary dark:text-text-darkSecondary">
        <span className="truncate font-medium text-[11px]">{description}</span>
        {trend && (
          <span className={`shrink-0 font-bold text-[11px] ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {trend.text}
          </span>
        )}
      </div>
    </Card>
  );
};
