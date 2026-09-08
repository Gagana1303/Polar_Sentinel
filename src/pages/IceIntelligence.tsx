import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Radar, Layers, Cpu, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const IceIntelligencePage: React.FC = () => {
  const { icebergs, selectIceberg, setActiveTab } = useAppStore();

  const pipelineSteps = [
    { title: 'Satellite Input', detail: 'Sentinel-1 EW C-Band SAR' },
    { title: 'Preprocessing', detail: 'Lee Speckle Filter & Calibration' },
    { title: 'Segmentation Model', detail: 'SegFormer-B3 Deep Neural Net' },
    { title: 'Iceberg Candidates', detail: 'Bounding Contour Extraction' },
    { title: 'Post Processing', detail: 'CFAR Edge Verification' },
    { title: 'Geospatial Objects', detail: 'Indexed Lat/Lng Features' },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">DEMO INFERENCE MODE</Badge>
            <span className="text-xs text-text-muted">Satellite Detection Pipeline</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            SATELLITE ICE DETECTION & SEGMENTATION
          </h2>
        </div>
      </div>

      {/* Detection Pipeline Flowchart Card */}
      <Card padding="lg">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-text-muted mb-4">
          <Cpu className="w-4 h-4 text-polar-700 dark:text-polar-400" />
          <span>SAR Segmentation Architecture</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-light-border dark:border-surface-dark-border space-y-1 relative"
            >
              <span className="text-[10px] font-bold text-polar-700 dark:text-polar-400">
                STEP 0{idx + 1}
              </span>
              <div className="text-xs font-extrabold text-text-primary dark:text-text-darkPrimary">
                {step.title}
              </div>
              <div className="text-[11px] text-text-secondary dark:text-text-darkSecondary">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detections Data Table */}
      <Card padding="md">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-light-border dark:border-surface-dark-border">
          <h3 className="text-base font-extrabold text-text-primary dark:text-text-darkPrimary">
            DETECTED GEOSPATIAL ICE OBJECTS
          </h3>
          <span className="text-xs font-semibold text-text-secondary">
            Sector Prydz Bay (5 Identified Objects)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-light-border dark:border-surface-dark-border text-text-muted font-bold uppercase tracking-wider">
                <th className="py-3 px-4">OBJECT ID</th>
                <th className="py-3 px-4">CLASSIFICATION</th>
                <th className="py-3 px-4">POSITION</th>
                <th className="py-3 px-4">DIMENSIONS</th>
                <th className="py-3 px-4">DRIFT SPEED</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-light-border dark:divide-surface-dark-border">
              {icebergs.map((ice) => (
                <tr key={ice.id} className="hover:bg-polar-50/50 dark:hover:bg-polar-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-text-primary dark:text-text-darkPrimary">
                    {ice.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={ice.lengthMeters > 1000 ? 'critical' : 'polar'} size="sm">
                      {ice.name.includes('Tabular') ? 'TABULAR ICEBERG' : 'ICEBERG'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {Math.abs(ice.lat).toFixed(2)}°S, {ice.lng.toFixed(2)}°E
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {ice.lengthMeters}m x {ice.widthMeters}m ({ice.areaKm2} km²)
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary dark:text-text-darkPrimary">
                    {ice.speedKnots} kn @ {ice.headingDeg}°
                  </td>
                  <td className="py-3.5 px-4 font-bold text-polar-700 dark:text-polar-400">
                    {ice.confidencePercent}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        selectIceberg(ice.id);
                        setActiveTab('tracking');
                      }}
                    >
                      TRACK OBJECT
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
