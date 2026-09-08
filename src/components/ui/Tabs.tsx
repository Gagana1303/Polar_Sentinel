import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, size = 'md' }) => {
  return (
    <div className="inline-flex p-1 bg-surface-light-border/40 dark:bg-surface-dark-border/40 rounded-2xl border border-surface-light-border dark:border-surface-dark-border backdrop-blur-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
              isActive
                ? 'bg-surface-light-card dark:bg-surface-dark-card text-polar-700 dark:text-polar-300 shadow-soft border border-surface-light-border dark:border-surface-dark-border'
                : 'text-text-secondary dark:text-text-darkSecondary hover:text-text-primary dark:hover:text-text-darkPrimary'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-polar-700 text-white'
                    : 'bg-surface-light-border dark:bg-surface-dark-border text-text-secondary dark:text-text-darkSecondary'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
