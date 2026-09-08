import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, Layers, HelpCircle, Wind, Waves, Snowflake } from 'lucide-react';

export const TrajectoryForecastPage: React.FC = () => {
  const { icebergs, selectedIcebergId } = useAppStore();
  const selectedIceberg = icebergs.find((i) => i.id === selectedIcebergId) || icebergs[0];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">PHYSICS-INFORMED AI MODEL</Badge>
            <span className="text-xs text-text-muted">Monte Carlo Trajectory Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            TRAJECTORY PREDICTION & UNCERTAINTY CORRIDORS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[550px]">
        {/* Map View */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-surface-light-border dark:border-surface-dark-border shadow-soft min-h-[500px]">
          <AntarcticMap />
        </div>

        {/* Uncertainty & Physics Explanation Card */}
        <div className="space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-polar-700 dark:text-polar-400">
              <TrendingUp className="w-4 h-4" />
              <span>MONTE CARLO UNCERTAINTY (500 RUNS)</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              We perturb ocean current vectors (±15%), wind leeway (±20%), and model variance to calculate spatial probability corridors for {selectedIceberg.name}.
            </p>

            <div className="space-y-2 border-t border-b border-surface-light-border dark:border-surface-dark-border py-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-text-primary dark:text-text-darkPrimary">
                  <span className="w-3 h-3 rounded bg-polar-700 opacity-90"></span>
                  Most Likely Trajectory
                </span>
                <span className="font-extrabold text-polar-700">Solid Line</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-text-primary dark:text-text-darkPrimary">
                  <span className="w-3 h-3 rounded bg-polar-700/30"></span>
                  80% Confidence Corridor
                </span>
                <span className="font-semibold text-text-secondary">±2.1 NM</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-text-primary dark:text-text-darkPrimary">
                  <span className="w-3 h-3 rounded bg-polar-700/10"></span>
                  95% Outer Bound
                </span>
                <span className="font-semibold text-text-secondary">±3.8 NM</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-polar-50 dark:bg-polar-950/40 border border-polar-200 dark:border-polar-800 text-xs text-polar-800 dark:text-polar-300 space-y-1">
              <div className="font-extrabold">Forecast Summary for {selectedIceberg.id}:</div>
              <div>Estimated minimum clearance to vessel corridor along direct path is <strong>5.8 NM</strong> at T+18h.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
