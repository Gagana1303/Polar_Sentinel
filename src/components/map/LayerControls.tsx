import React from 'react';
import { useAppStore, MapLayerState } from '../../store/useAppStore';
import { Layers, Eye, EyeOff } from 'lucide-react';

export const LayerControls: React.FC = () => {
  const { layers, toggleLayer } = useAppStore();

  const layerItems: { key: keyof MapLayerState; label: string }[] = [
    { key: 'seaIce', label: 'Sea Ice Concentration' },
    { key: 'icebergs', label: 'Iceberg Detections' },
    { key: 'historicalTracks', label: 'Historical Tracks' },
    { key: 'predictedTrajectories', label: 'Predicted Trajectories' },
    { key: 'uncertaintyCorridors', label: 'Uncertainty Corridors' },
    { key: 'vessel', label: 'Research Vessel Aurora' },
    { key: 'routes', label: 'Navigation Routes' },
    { key: 'riskZones', label: 'High-Risk Heatmaps' },
  ];

  return (
    <div className="bg-surface-light-card/90 dark:bg-surface-dark-card/90 backdrop-blur-md border border-surface-light-border dark:border-surface-dark-border p-3.5 rounded-3xl shadow-soft text-xs w-60 space-y-2">
      <div className="flex items-center gap-2 font-bold text-text-primary dark:text-text-darkPrimary pb-2 border-b border-surface-light-border dark:border-surface-dark-border">
        <Layers className="w-4 h-4 text-polar-700 dark:text-polar-400" />
        <span>Map Layers</span>
      </div>

      <div className="space-y-1">
        {layerItems.map((item) => {
          const isActive = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-polar-50 dark:bg-polar-950/60 text-polar-700 dark:text-polar-300 font-semibold'
                  : 'text-text-secondary dark:text-text-darkSecondary hover:text-text-primary'
              }`}
            >
              <span>{item.label}</span>
              {isActive ? (
                <Eye className="w-3.5 h-3.5 text-polar-700 dark:text-polar-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
