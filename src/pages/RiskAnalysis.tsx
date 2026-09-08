import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { RiskPanel } from '../components/risk/RiskPanel';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RiskAnalysisPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="critical" size="sm">SIH RISK ENGINE</Badge>
            <span className="text-xs text-text-muted">Clearance & Safety Thresholds</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            EXPLAINABLE COLLISION RISK ANALYSIS
          </h2>
        </div>
      </div>

      {/* Safety Threshold Reference Banner */}
      <Card padding="md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3 block">
          POLAR MARITIME SAFETY CLEARANCE THRESHOLDS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" /> SAFE CLEARANCE
            </div>
            <div className="text-lg font-extrabold">&gt; 15 NM</div>
            <div className="text-[11px] opacity-80 mt-0.5">Unrestricted polar transit zone</div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertTriangle className="w-4 h-4" /> WARNING
            </div>
            <div className="text-lg font-extrabold">8 – 15 NM</div>
            <div className="text-[11px] opacity-80 mt-0.5">Enhanced radar & visual watch</div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 text-orange-800 dark:text-orange-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" /> HIGH RISK
            </div>
            <div className="text-lg font-extrabold">4 – 8 NM</div>
            <div className="text-[11px] opacity-80 mt-0.5">Prepare speed reduction & course shift</div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertOctagon className="w-4 h-4" /> CRITICAL
            </div>
            <div className="text-lg font-extrabold">&lt; 4 NM</div>
            <div className="text-[11px] opacity-80 mt-0.5">Immediate evasive maneuver required</div>
          </div>
        </div>
      </Card>

      {/* Main Explainable Risk Panel */}
      <RiskPanel />
    </div>
  );
};
