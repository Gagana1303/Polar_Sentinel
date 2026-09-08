import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Card';
import { RiskBadge } from '../ui/RiskBadge';
import { Badge } from '../ui/Badge';
import { Navigation, Anchor, Compass, Clock, MapPin } from 'lucide-react';
import { interpolateVesselPosition } from '../../utils/geo';

export const VesselStatus: React.FC = () => {
  const { vessel, routes, selectedRouteId, simulationTimeOffset, riskAssessment } = useAppStore();
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[2];
  const currentPos = interpolateVesselPosition(vessel, activeRoute, simulationTimeOffset);

  return (
    <Card padding="md" className="bg-surface-light-card/95 dark:bg-surface-dark-card/95 backdrop-blur-md border-surface-light-border dark:border-surface-dark-border shadow-soft">
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-polar-700 text-white shadow-soft">
            <Anchor className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              VESSEL STATUS
            </span>
            <h3 className="text-base font-extrabold text-text-primary dark:text-text-darkPrimary leading-tight">
              {vessel.name}
            </h3>
          </div>
        </div>

        <RiskBadge level={riskAssessment.riskLevel} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
          <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-polar-700" /> Current Position
          </span>
          <div className="font-extrabold text-text-primary dark:text-text-darkPrimary mt-1">
            {Math.abs(currentPos.lat).toFixed(2)}°S, {currentPos.lng.toFixed(2)}°E {simulationTimeOffset !== 0 ? `(T${simulationTimeOffset >= 0 ? '+' : ''}${simulationTimeOffset}h)` : ''}
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
          <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
            <Compass className="w-3 h-3 text-polar-700" /> Speed & Heading
          </span>
          <div className="font-extrabold text-text-primary dark:text-text-darkPrimary mt-1">
            {vessel.speedKnots} kn @ {currentPos.headingDeg}°
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
          <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
            <Navigation className="w-3 h-3 text-polar-700" /> Active Route
          </span>
          <div className="font-extrabold text-polar-700 dark:text-polar-400 mt-1 flex items-center gap-1.5">
            <span>{activeRoute.code}</span>
            <Badge variant="polar" size="sm">{activeRoute.tag}</Badge>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border">
          <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-polar-700" /> Destination ETA
          </span>
          <div className="font-extrabold text-text-primary dark:text-text-darkPrimary mt-1">
            {activeRoute.etaDaysHours}
          </div>
        </div>
      </div>
    </Card>
  );
};

