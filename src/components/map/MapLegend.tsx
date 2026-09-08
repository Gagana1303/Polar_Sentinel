import React from 'react';
import { Info } from 'lucide-react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-surface-light-card/90 dark:bg-surface-dark-card/90 backdrop-blur-md border border-surface-light-border dark:border-surface-dark-border p-3.5 rounded-3xl shadow-soft text-xs space-y-2 max-w-xs">
      <div className="flex items-center gap-1.5 font-bold text-text-primary dark:text-text-darkPrimary">
        <Info className="w-3.5 h-3.5 text-polar-700 dark:text-polar-400" />
        <span>Polar Intelligence Legend</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-text-secondary dark:text-text-darkSecondary">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span>
          <span>Critical Risk Iceberg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
          <span>Medium Risk Iceberg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span>Low Risk Iceberg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rotate-45 bg-polar-700 border border-white"></span>
          <span>Research Vessel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-rose-500"></span>
          <span>Route A (High Risk)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-polar-700"></span>
          <span>Route C (Recommended)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-2 bg-polar-700/20 border border-polar-700/40 rounded"></span>
          <span>80% Uncertainty Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-2 bg-rose-500/20 border border-rose-500/40 rounded"></span>
          <span>Risk Corridor Intersect</span>
        </div>
      </div>
    </div>
  );
};
