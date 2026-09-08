import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, CheckCircle2, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const {
    simulationTimeOffset,
    setSimulationTimeOffset,
    isSimulating,
    setIsSimulating,
    runFullSihDemo,
    selectedRouteId,
  } = useAppStore();

  const getStorylineStep = (offset: number) => {
    switch (offset) {
      case -72:
      case -48:
        return {
          title: 'HISTORICAL BASELINE',
          text: 'Vessel in routine Antarctic transit. No significant ice obstacles reported along planned channel.',
          status: 'NORMAL',
          severity: 'info',
        };
      case -24:
        return {
          title: 'SATELLITE PASS PROCESSED',
          text: 'At T-24h: Sentinel-1 SAR pass acquires imagery over Sector Prydz Bay. Initial baseline route appears clear.',
          status: 'SAFE',
          severity: 'info',
        };
      case 0:
        return {
          title: 'ICEBERG DETECTED',
          text: 'At NOW: Segmentation model identifies Tabular Iceberg A-17 (1.45 km length) drifting southeast.',
          status: 'WATCH',
          severity: 'warning',
        };
      case 6:
        return {
          title: 'TRACKING CONFIRMED',
          text: 'At +6h: Kinematics confirm drift speed of 0.42 knots at 127° heading under 0.31 m/s ocean current forcing.',
          status: 'MONITORING',
          severity: 'warning',
        };
      case 12:
        return {
          title: 'TRAJECTORY INTERSECTION FORECAST',
          text: 'At +12h: Physics engine projects drift path toward vessel safety envelope along Route A.',
          status: 'PRE-CONFLICT',
          severity: 'warning',
        };
      case 18:
        return {
          title: 'HIGH RISK DETECTED',
          text: 'At +18h: Minimum clearance drops to 5.8 NM (below 15 NM threshold). Risk score reaches 78/100 (HIGH).',
          status: 'HIGH RISK',
          severity: 'critical',
        };
      case 24:
        return {
          title: 'RE-ROUTING EXECUTED',
          text: 'At +24h: Vessel executes Northern Arc diversion (Route C), widening safety clearance to 18.5 NM.',
          status: 'DIVERSION ACTIVE',
          severity: 'info',
        };
      case 48:
        return {
          title: 'CONFLICT AVOIDED',
          text: 'At +48h: Vessel safely clears Iceberg A-17 drift zone without incident. Safe passage achieved.',
          status: 'CONFLICT AVOIDED',
          severity: 'success',
        };
      default:
        return {
          title: 'SIMULATION ACTIVE',
          text: 'Tracking object drift and vessel position across temporal timeline.',
          status: 'RUNNING',
          severity: 'info',
        };
    }
  };

  const currentStep = getStorylineStep(simulationTimeOffset);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">SIH JUDGING SCENARIO</Badge>
            <span className="text-xs text-text-muted">Deterministic Operational Demo</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            END-TO-END SCENARIO SIMULATOR
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={runFullSihDemo}
            icon={<Sparkles className="w-4 h-4 fill-current" />}
            className="shadow-glow-teal"
          >
            PLAY FULL SIH STORYLINE
          </Button>
        </div>
      </div>

      {/* Storyline Status Banner */}
      <Card padding="md" className="bg-surface-light-card dark:bg-surface-dark-card border-l-4 border-l-polar-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-polar-700 dark:text-polar-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                TEMPORAL STEP: {simulationTimeOffset === 0 ? 'NOW (PRESENT)' : `${simulationTimeOffset > 0 ? '+' : ''}${simulationTimeOffset} HOURS`}
              </span>
              <Badge variant={currentStep.severity as any} size="sm">
                {currentStep.status}
              </Badge>
            </div>
            <h3 className="text-lg font-extrabold text-text-primary dark:text-text-darkPrimary">
              {currentStep.title}
            </h3>
            <p className="text-xs text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              {currentStep.text}
            </p>
          </div>

          {simulationTimeOffset >= 24 && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 font-extrabold text-xs flex items-center gap-2 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>CONFLICT AVOIDED VIA ROUTE C</span>
            </div>
          )}
        </div>
      </Card>

      {/* Map View */}
      <div className="h-[550px] rounded-3xl overflow-hidden border border-surface-light-border dark:border-surface-dark-border shadow-soft">
        <AntarcticMap />
      </div>
    </div>
  );
};
