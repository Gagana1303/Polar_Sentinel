import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Terminal, X } from 'lucide-react';
import { interpolateVesselPosition, interpolateIcebergPosition } from '../../utils/geo';

export const DebugPanel: React.FC = () => {
  const {
    isDebugMode,
    toggleDebugMode,
    simulationTimeOffset,
    selectedIcebergId,
    selectedRouteId,
    vessel,
    icebergs,
    routes,
    riskAssessment,
    dataMode,
    liveApiStatus,
    layers,
    settings,
  } = useAppStore();

  if (!isDebugMode) return null;

  const selectedIce = icebergs.find((i) => i.id === selectedIcebergId) || icebergs[0];
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const vPos = interpolateVesselPosition(vessel, selectedRoute, simulationTimeOffset);
  const iPos = interpolateIcebergPosition(selectedIce, simulationTimeOffset);

  return (
    <div className="fixed bottom-16 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 text-slate-100 backdrop-blur-md rounded-3xl border border-emerald-500/30 p-4 shadow-2xl font-mono text-xs space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>SYSTEM DEBUG CONSOLE</span>
        </div>
        <button onClick={toggleDebugMode} className="p-1 text-slate-400 hover:text-white rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5 text-[11px] leading-relaxed">
        <div className="flex justify-between">
          <span className="text-slate-400">SIMULATION TIME:</span>
          <span className="font-bold text-amber-400">T{simulationTimeOffset >= 0 ? '+' : ''}{simulationTimeOffset}h</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">SELECTED ICEBERG:</span>
          <span className="font-bold text-cyan-300">{selectedIcebergId} ({selectedIce.name})</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">ICEBERG POS:</span>
          <span>{iPos.lat.toFixed(2)}°S, {iPos.lng.toFixed(2)}°E</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">SELECTED ROUTE:</span>
          <span className="font-bold text-emerald-400">{selectedRouteId} ({selectedRoute.code})</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">VESSEL POS:</span>
          <span>{vPos.lat.toFixed(2)}°S, {vPos.lng.toFixed(2)}°E</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">RISK SCORE / LEVEL:</span>
          <span className="font-bold text-rose-400">{riskAssessment.overallScore}/100 ({riskAssessment.riskLevel.toUpperCase()})</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">MIN CLEARANCE:</span>
          <span>{riskAssessment.predictedMinClearanceNm} NM</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">DATA PIPELINE MODE:</span>
          <span className="font-bold text-emerald-300">{dataMode} ({liveApiStatus})</span>
        </div>

        <div className="flex justify-between border-t border-slate-800 pt-1.5">
          <span className="text-slate-400">ACTIVE LAYERS:</span>
          <span>
            {Object.entries(layers)
              .filter(([_, v]) => v)
              .map(([k]) => k)
              .slice(0, 4)
              .join(', ')}...
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">SETTINGS THRESHOLD:</span>
          <span>{settings.minSafetyBufferNm} NM Buffer / {settings.stochasticIterations} Runs</span>
        </div>
      </div>
    </div>
  );
};
