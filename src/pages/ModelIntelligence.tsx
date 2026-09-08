import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BrainCircuit, Cpu, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const ModelIntelligencePage: React.FC = () => {
  const models = [
    {
      name: 'Iceberg Detection & Segmentation Engine',
      inputs: 'Sentinel-1 EW C-Band SAR, Sentinel-2 Optical',
      method: 'SegFormer-B3 Deep Convolutional Architecture + Constant False Alarm Rate (CFAR) post-filter',
      output: 'Georeferenced Iceberg Polygons (Length, Width, Area)',
      confidence: '94% Validation F1-Score',
    },
    {
      name: 'Physics-Informed Trajectory Predictor',
      inputs: 'Iceberg dimensions, position, ocean currents (NEMO), wind (ERA5), sea ice concentration',
      method: 'Vector-summation drift mechanics (V = C_ocean*V_curr + C_wind*V_wind)',
      output: '6h to 72h forecast trajectory points & velocity',
      confidence: '0.18 NM/hr Mean Error Growth',
    },
    {
      name: 'Monte Carlo Uncertainty Engine',
      inputs: 'Environmental variance, ocean current perturbations, wind leeway uncertainty',
      method: '500-run stochastic Monte Carlo perturbation',
      output: '50%, 80%, 95% spatial confidence corridors',
      confidence: '80% CI spatial coverage verified',
    },
    {
      name: 'Explainable Collision Risk Engine',
      inputs: 'Vessel trajectory, iceberg uncertainty corridor, size, sea-ice density',
      method: 'Time-aligned Haversine minimum clearance evaluation + composite risk formula',
      output: 'Risk Score (0-100) & Categorical Risk Level',
      confidence: 'Transparent Non-Blackbox',
    },
    {
      name: 'A* Graph Route Optimizer',
      inputs: 'Navigational bathymetry grid, sea ice cost, iceberg prediction risk corridor',
      method: 'A* shortest-cost path algorithm with dynamic risk penalties',
      output: 'Optimized Route A, B, C with trade-off analysis',
      confidence: 'Deterministic Global Optimum',
    },
  ];

  const reasoningSteps = [
    'Iceberg detected 42 km east of planned vessel corridor via Sentinel-1 SAR pass.',
    'Historical 72h motion analysis confirms steady southeastward drift velocity (0.42 kn @ 127°).',
    'ERA5 wind vectors and Copernicus ocean currents support continued drift toward vessel corridor.',
    'Predicted 80% uncertainty corridor intersects direct route (Route A) safety buffer in ~18 hours.',
    'Route C (Northern Arc) maintains wider clearance (18.5 NM) while adding +72 NM (+8h ETA).',
    'Route C is recommended to avoid predicted collision risk window.',
  ];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">TRANSPARENT AI ARCHITECTURE</Badge>
            <span className="text-xs text-text-muted">SIH 2026 Model Documentation</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            MODEL INTELLIGENCE & EXPLAINABILITY
          </h2>
        </div>
      </div>

      {/* System Reasoning Steps Card */}
      <Card padding="lg" className="bg-polar-50/60 dark:bg-polar-950/40 border border-polar-200 dark:border-polar-800">
        <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-polar-700 dark:text-polar-400 mb-4">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>SYSTEM REASONING CHAIN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reasoningSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-surface-light-card dark:bg-surface-dark-card border border-surface-light-border dark:border-surface-dark-border flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-polar-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs text-text-primary dark:text-text-darkPrimary font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Model Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-text-primary dark:text-text-darkPrimary">
          CORE AI PIPELINE COMPONENTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model, idx) => (
            <Card key={idx} padding="md" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-polar-700 dark:text-polar-400 uppercase tracking-wider">
                  COMPONENT 0{idx + 1}
                </span>
                <Badge variant="polar" size="sm">{model.confidence}</Badge>
              </div>

              <h4 className="text-base font-extrabold text-text-primary dark:text-text-darkPrimary">
                {model.name}
              </h4>

              <div className="space-y-2 text-xs pt-2 border-t border-surface-light-border dark:border-surface-dark-border">
                <div>
                  <span className="font-bold text-text-muted">INPUTS: </span>
                  <span className="text-text-secondary">{model.inputs}</span>
                </div>
                <div>
                  <span className="font-bold text-text-muted">METHOD: </span>
                  <span className="text-text-secondary">{model.method}</span>
                </div>
                <div>
                  <span className="font-bold text-text-muted">OUTPUT: </span>
                  <span className="text-text-secondary">{model.output}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
