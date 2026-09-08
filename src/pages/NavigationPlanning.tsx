import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { RouteComparison } from '../components/route/RouteComparison';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Navigation, MapPin, Anchor, Sparkles } from 'lucide-react';

export const NavigationPlanningPage: React.FC = () => {
  const { vessel, recalculateRoutes } = useAppStore();

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">A* GRAPH OPTIMIZER</Badge>
            <span className="text-xs text-text-muted">Navigation Decision Support</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            OPTIMIZED SAFE ROUTE ENGINE
          </h2>
        </div>
      </div>

      {/* Start & Destination Config Bar */}
      <Card padding="md" className="bg-surface-light-card dark:bg-surface-dark-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-polar-700 text-white">
                <Anchor className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted">ORIGIN VESSEL</span>
                <div className="font-extrabold text-text-primary dark:text-text-darkPrimary">{vessel.name}</div>
              </div>
            </div>

            <div className="hidden sm:block text-text-muted">→</div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-polar-50 dark:bg-polar-950 text-polar-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted">DESTINATION</span>
                <div className="font-extrabold text-text-primary dark:text-text-darkPrimary">{vessel.destination}</div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={recalculateRoutes}
            icon={<Sparkles className="w-4 h-4 fill-current" />}
            className="w-full md:w-auto shadow-glow-teal"
          >
            RECALCULATE OPTIMAL ROUTES
          </Button>
        </div>
      </Card>

      {/* Route Cards & AI Recommendation */}
      <RouteComparison />

      {/* Map Preview */}
      <div className="h-[450px] rounded-3xl overflow-hidden border border-surface-light-border dark:border-surface-dark-border shadow-soft">
        <AntarcticMap />
      </div>
    </div>
  );
};

