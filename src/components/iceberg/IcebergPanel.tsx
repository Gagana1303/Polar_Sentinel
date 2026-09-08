import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from '../ui/RiskBadge';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { X, Navigation2, Compass, ShieldAlert, Wind, Waves, Snowflake } from 'lucide-react';
import { interpolateIcebergPosition } from '../../utils/geo';

export const IcebergPanel: React.FC = () => {
  const { icebergs, selectedIcebergId, selectIceberg, setActiveTab, simulationTimeOffset, riskAssessment, environment } = useAppStore();
  const [activeTabId, setActiveTabId] = useState('overview');

  const iceberg = icebergs.find((i) => i.id === selectedIcebergId) || icebergs[0];

  if (!iceberg) return null;

  const currentPos = interpolateIcebergPosition(iceberg, simulationTimeOffset);

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'forecast', label: 'FORECAST' },
    { id: 'physics', label: 'WHY IT MOVES' },
    { id: 'risk', label: 'RISK' },
  ];

  return (
    <Card padding="none" className="w-full max-w-md bg-surface-light-card/95 dark:bg-surface-dark-card/95 backdrop-blur-md shadow-soft-lg border-surface-light-border dark:border-surface-dark-border overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-surface-light-border dark:border-surface-dark-border flex items-start justify-between bg-polar-50/40 dark:bg-polar-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="polar" size="sm">{iceberg.detectionSource}</Badge>
            <span className="text-[11px] text-text-secondary dark:text-text-darkSecondary">
              Observed {iceberg.lastObservation}
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary">
            {iceberg.name}
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary mt-0.5">
            Position: {Math.abs(currentPos.lat).toFixed(2)}°S, {currentPos.lng.toFixed(2)}°E {simulationTimeOffset !== 0 ? `(T${simulationTimeOffset >= 0 ? '+' : ''}${simulationTimeOffset}h)` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={riskAssessment.riskLevel} size="sm" />
          <button
            onClick={() => selectIceberg(null)}
            className="p-1 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
            title="Deselect Iceberg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 border-b border-surface-light-border dark:border-surface-dark-border bg-surface-light/50 dark:bg-surface-dark-border/20">
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={setActiveTabId} size="sm" />
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
        {activeTabId === 'overview' && (
          <div className="space-y-4">
            {/* Grid Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Drift Speed</span>
                <div className="text-lg font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">
                  {currentPos.speedKnots} <span className="text-xs font-medium">knots</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Drift Heading</span>
                <div className="text-lg font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">
                  {currentPos.headingDeg}° <span className="text-xs font-medium">SE</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Dimensions</span>
                <div className="text-lg font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">
                  {(iceberg.lengthMeters / 1000).toFixed(2)} x {(iceberg.widthMeters / 1000).toFixed(2)} <span className="text-xs font-medium">km</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Detection Confidence</span>
                <div className="text-lg font-extrabold text-polar-700 dark:text-polar-400 mt-0.5">
                  {iceberg.confidencePercent}%
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('forecast')}
                icon={<Navigation2 className="w-3.5 h-3.5" />}
              >
                VIEW TRAJECTORY
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('risk')}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
              >
                ANALYZE RISK
              </Button>
            </div>
          </div>
        )}

        {activeTabId === 'forecast' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary flex justify-between items-center">
              <span>Predicted Trajectory Horizon</span>
              <Badge variant="polar" size="sm">Physics Engine</Badge>
            </div>

            <div className="space-y-2">
              {iceberg.forecastTrack.map((pt) => (
                <div
                  key={pt.timeOffsetHours}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs ${
                    simulationTimeOffset === pt.timeOffsetHours
                      ? 'bg-polar-700 text-white border-polar-600 font-bold'
                      : 'bg-surface-light dark:bg-surface-dark border-surface-light-border dark:border-surface-dark-border'
                  }`}
                >
                  <div className="font-bold w-12">
                    +{pt.timeOffsetHours}h
                  </div>
                  <div>
                    {Math.abs(pt.lat).toFixed(2)}°S, {pt.lng.toFixed(2)}°E
                  </div>
                  <div className="font-semibold">
                    {pt.speedKnots} kn @ {pt.headingDeg}°
                  </div>
                  <div className="text-[10px] opacity-80">
                    ±{pt.uncertaintyRadiusNm} NM
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTabId === 'physics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary dark:text-text-darkPrimary">
                WHY IS IT MOVING?
              </span>
              <Badge variant="outline" size="sm" className="text-[9px]">
                ILLUSTRATIVE DEMO ATTRIBUTION
              </Badge>
            </div>

            {/* Attribution Breakdown Bars */}
            <div className="space-y-3 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-surface-light-border dark:border-surface-dark-border">
              {/* Ocean Currents */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary dark:text-text-darkPrimary">
                    <Waves className="w-3.5 h-3.5 text-polar-700" />
                    Ocean Currents ({environment.oceanCurrentSpeedMs} m/s @ {environment.oceanCurrentDirDeg}°)
                  </span>
                  <span className="font-bold text-polar-700">{iceberg.physicsAttribution.oceanCurrentPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-light-border dark:bg-surface-dark-border overflow-hidden">
                  <div
                    className="h-full bg-polar-700 rounded-full"
                    style={{ width: `${iceberg.physicsAttribution.oceanCurrentPercent}%` }}
                  />
                </div>
              </div>

              {/* Wind Forcing */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary dark:text-text-darkPrimary">
                    <Wind className="w-3.5 h-3.5 text-ice-500" />
                    Wind Leeway ({environment.windSpeedKnots} kn @ {environment.windDirDeg}°)
                  </span>
                  <span className="font-bold text-ice-500">{iceberg.physicsAttribution.windPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-light-border dark:bg-surface-dark-border overflow-hidden">
                  <div
                    className="h-full bg-ice-500 rounded-full"
                    style={{ width: `${iceberg.physicsAttribution.windPercent}%` }}
                  />
                </div>
              </div>

              {/* Sea Ice Drag */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-text-primary dark:text-text-darkPrimary">
                    <Snowflake className="w-3.5 h-3.5 text-amber-500" />
                    Sea Ice Drag ({environment.seaIceConcentrationPercent}% Pack)
                  </span>
                  <span className="font-bold text-amber-500">{iceberg.physicsAttribution.seaIcePercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-light-border dark:bg-surface-dark-border overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${iceberg.physicsAttribution.seaIcePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTabId === 'risk' && (
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              riskAssessment.riskLevel === 'critical' || riskAssessment.riskLevel === 'high'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Clearance Assessment
                </span>
                <span>{riskAssessment.predictedMinClearanceNm} NM</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {riskAssessment.summaryExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

