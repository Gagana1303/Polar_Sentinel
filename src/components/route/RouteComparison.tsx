import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from '../ui/RiskBadge';
import { Button } from '../ui/Button';
import { Sparkles, AlertTriangle, ShieldCheck, Fuel, Compass, ShieldAlert } from 'lucide-react';

export const RouteComparison: React.FC = () => {
  const { routes, selectedRouteId, selectRoute } = useAppStore();

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[2];

  return (
    <div className="space-y-6">
      {/* Route Selector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          return (
            <Card
              key={route.id}
              onClick={() => selectRoute(route.id)}
              hoverable
              padding="md"
              className={`relative overflow-hidden transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-2 border-polar-700 dark:border-polar-400 shadow-glow-teal ring-1 ring-polar-700/20 scale-[1.01]'
                  : 'opacity-90 hover:opacity-100 hover:border-polar-700/40'
              }`}
            >
              {/* Recommended Top Banner */}
              {route.isRecommended && (
                <div className="absolute top-0 right-0 bg-polar-700 text-white px-3.5 py-1 rounded-bl-2xl text-[10px] font-extrabold tracking-widest flex items-center gap-1.5 shadow-soft">
                  <Sparkles className="w-3 h-3 fill-current animate-spin-slow" />
                  <span>AI RECOMMENDED</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3 pt-1">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                    {route.code}
                  </span>
                  <h4 className="text-base font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">
                    {route.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant={route.isRecommended ? 'polar' : 'default'} size="sm">
                  {route.tag}
                </Badge>
                <RiskBadge level={route.riskLevel} size="sm" />
              </div>

              {/* Metrics */}
              <div className="space-y-2.5 border-t border-b border-surface-light-border dark:border-surface-dark-border py-3.5 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-darkSecondary font-medium">Distance</span>
                  <span className="font-extrabold text-text-primary dark:text-text-darkPrimary">
                    {route.distanceNm.toLocaleString()} NM
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-darkSecondary font-medium">Estimated ETA</span>
                  <span className="font-semibold text-text-primary dark:text-text-darkPrimary">
                    {route.etaDaysHours}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-darkSecondary font-medium">Minimum Clearance</span>
                  <span className={`font-bold ${route.minimumClearanceNm < 15 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {route.minimumClearanceNm} NM
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-darkSecondary font-medium">Sea-Ice Exposure</span>
                  <span className={`font-bold ${route.iceExposurePercent > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {route.iceExposurePercent}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-darkSecondary font-medium flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-polar-700" /> Fuel Estimate
                  </span>
                  <span className="font-bold text-text-primary dark:text-text-darkPrimary">
                    {route.fuelEstimateTonnes || 145} Tonnes
                  </span>
                </div>
              </div>

              <Button
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                className="w-full font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  selectRoute(route.id);
                }}
              >
                {isSelected ? 'SELECTED ROUTE' : 'SELECT THIS ROUTE'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* "WHY THIS ROUTE?" Explainable AI Card */}
      <Card
        padding="lg"
        className={`shadow-soft ${
          selectedRoute.isRecommended
            ? 'bg-polar-50/70 dark:bg-polar-950/50 border border-polar-200 dark:border-polar-800/80'
            : selectedRoute.riskLevel === 'high'
            ? 'bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
            : 'bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className={`p-3.5 rounded-2xl text-white shadow-soft shrink-0 ${
              selectedRoute.isRecommended ? 'bg-polar-700' : selectedRoute.riskLevel === 'high' ? 'bg-rose-600' : 'bg-amber-600'
            }`}
          >
            {selectedRoute.isRecommended ? <Sparkles className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-text-primary dark:text-text-darkPrimary">
                  EXPLAINABLE ROUTE ASSESSMENT
                </span>
                <Badge variant={selectedRoute.isRecommended ? 'polar' : selectedRoute.riskLevel === 'high' ? 'critical' : 'warning'} size="sm">
                  {selectedRoute.code}
                </Badge>
              </div>
              <h3 className="text-lg font-extrabold text-text-primary dark:text-text-darkPrimary">
                {selectedRoute.isRecommended
                  ? 'WHY ROUTE C IS RECOMMENDED'
                  : `RISK EVALUATION FOR ${selectedRoute.name.toUpperCase()}`}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed font-medium">
              "{selectedRoute.explanation}"
            </p>

            {/* Trade-off pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border dark:border-surface-dark-border text-center shadow-2xs">
                <span className="text-[10px] font-bold text-text-muted uppercase">Total Distance</span>
                <div className="text-sm font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">{selectedRoute.distanceNm} NM</div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border dark:border-surface-dark-border text-center shadow-2xs">
                <span className="text-[10px] font-bold text-text-muted uppercase">Estimated ETA</span>
                <div className="text-sm font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">{selectedRoute.etaDaysHours}</div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border dark:border-surface-dark-border text-center shadow-2xs">
                <span className="text-[10px] font-bold text-text-muted uppercase">Minimum Clearance</span>
                <div
                  className={`text-sm font-extrabold mt-0.5 ${
                    selectedRoute.minimumClearanceNm < 15 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {selectedRoute.minimumClearanceNm} NM
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border dark:border-surface-dark-border text-center shadow-2xs">
                <span className="text-[10px] font-bold text-text-muted uppercase">Risk Score</span>
                <div
                  className={`text-sm font-extrabold mt-0.5 ${
                    selectedRoute.riskScore >= 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {selectedRoute.riskScore} / 100 ({selectedRoute.riskLevel.toUpperCase()})
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

