import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { IcebergPanel } from '../components/iceberg/IcebergPanel';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Clock } from 'lucide-react';

export const IcebergTrackingPage: React.FC = () => {
  const { icebergs, selectedIcebergId, selectIceberg } = useAppStore();
  const selectedIceberg = icebergs.find((i) => i.id === selectedIcebergId) || icebergs[0];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">HISTORICAL & FORWARD TRACKING</Badge>
            <span className="text-xs text-text-muted">72h Historical + 72h Forecast</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            ICEBERG KINEMATICS & TRAJECTORY TRACKING
          </h2>
        </div>

        {/* Iceberg selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {icebergs.map((ice) => (
            <button
              key={ice.id}
              onClick={() => selectIceberg(ice.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                ice.id === selectedIceberg.id
                  ? 'bg-polar-700 text-white shadow-soft'
                  : 'bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {ice.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[550px]">
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-surface-light-border dark:border-surface-dark-border shadow-soft min-h-[500px]">
          <AntarcticMap />
        </div>

        <div className="space-y-6">
          <IcebergPanel />
        </div>
      </div>
    </div>
  );
};
