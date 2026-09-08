import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from '../ui/RiskBadge';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, HelpCircle, Compass, Sparkles } from 'lucide-react';

export const RiskPanel: React.FC = () => {
  const { riskAssessment, selectedIcebergId, icebergs, vessel, selectedRouteId, routes } = useAppStore();
  const selectedIceberg = icebergs.find((i) => i.id === selectedIcebergId) || icebergs[0];
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[2];

  const isHighRisk = riskAssessment.riskLevel === 'high' || riskAssessment.riskLevel === 'critical';

  return (
    <div className="space-y-6">
      {/* Top Header Card with Overall Score */}
      <Card padding="lg" className="bg-surface-light-card dark:bg-surface-dark-card border-surface-light-border dark:border-surface-dark-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={isHighRisk ? 'critical' : 'polar'} size="sm">SIH RISK ENGINE v2.4</Badge>
              <span className="text-xs text-text-muted">Target Object: {selectedIceberg.name} ({selectedRoute.code})</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary">
              EXPLAINABLE RISK EVALUATION
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-xl">
              {riskAssessment.summaryExplanation}
            </p>
          </div>

          <div
            className={`flex items-center gap-4 p-4 rounded-3xl border shrink-0 ${
              isHighRisk
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
            }`}
          >
            <div className="text-center">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isHighRisk ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
                }`}
              >
                TOTAL RISK SCORE
              </span>
              <div
                className={`text-4xl font-extrabold mt-1 ${
                  isHighRisk ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {riskAssessment.overallScore}
                <span className="text-sm opacity-70 font-normal">/100</span>
              </div>
            </div>
            <RiskBadge level={riskAssessment.riskLevel} size="lg" />
          </div>
        </div>
      </Card>

      {/* Recommended Action Card */}
      <Card
        padding="md"
        className={`border-l-4 ${
          isHighRisk ? 'border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/20' : 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl text-white shadow-soft shrink-0 ${
              isHighRisk ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            {isHighRisk ? <ShieldAlert className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
              RECOMMENDED DECISION ACTION
            </span>
            <div className="text-sm font-extrabold text-text-primary dark:text-text-darkPrimary mt-0.5">
              {riskAssessment.recommendedAction}
            </div>
          </div>
        </div>
      </Card>

      {/* Transparent Formula Breakdown */}
      <Card padding="md">
        <div className="flex items-center justify-between pb-3 border-b border-surface-light-border dark:border-surface-dark-border mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-polar-700 dark:text-polar-400" />
            <h4 className="text-sm font-extrabold text-text-primary dark:text-text-darkPrimary">
              TRANSPARENT SCIENTIFIC RISK FORMULA
            </h4>
          </div>
          <Badge variant="outline" size="sm">Non-Blackbox AI</Badge>
        </div>

        <p className="text-xs text-text-secondary dark:text-text-darkSecondary mb-4">
          Risk = (Distance Hazard Score × 0.45) + (Monte Carlo Uncertainty × 0.25) + (Iceberg Momentum & Scale × 0.20) + (Sea-Ice Concentration × 0.10)
        </p>

        {/* Contributing Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskAssessment.contributingFactors.map((factor, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-text-primary dark:text-text-darkPrimary">
                    {factor.label}
                  </span>
                  <Badge
                    variant={factor.impact === 'critical' || factor.impact === 'high' ? 'critical' : 'warning'}
                    size="sm"
                  >
                    {factor.impact.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-darkSecondary leading-relaxed">
                  {factor.description}
                </p>
              </div>

              <div className="text-right shrink-0 pl-3">
                <span className="text-sm font-extrabold text-text-primary dark:text-text-darkPrimary">
                  {factor.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

