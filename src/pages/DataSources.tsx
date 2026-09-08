import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Database, Satellite, Wind, Layers, CheckCircle2 } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { dataSources, dataMode } = useAppStore();

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-light-border dark:border-surface-dark-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="polar" size="sm">DATA PROVENANCE</Badge>
            <span className="text-xs text-text-muted">Real & Synthetic Ingestion Connectors</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary mt-1">
            DATA SOURCES & SATELLITE INTEGRATION
          </h2>
        </div>

        <Badge variant={dataMode === 'DEMO' ? 'polar' : 'success'} size="md">
          CURRENT PIPELINE MODE: {dataMode}
        </Badge>
      </div>

      <Card padding="md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-light-border dark:border-surface-dark-border text-text-muted font-bold uppercase tracking-wider">
                <th className="py-3 px-4">DATASET / SATELLITE</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">PROVIDER</th>
                <th className="py-3 px-4">RESOLUTION</th>
                <th className="py-3 px-4">UPDATE FREQUENCY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">MODE</th>
                <th className="py-3 px-4 text-right">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-light-border dark:divide-surface-dark-border">
              {dataSources.map((ds, idx) => (
                <tr key={idx} className="hover:bg-polar-50/50 dark:hover:bg-polar-950/20 transition-colors">
                  <td className="py-4 px-4 font-extrabold text-text-primary dark:text-text-darkPrimary">
                    {ds.name}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" size="sm">
                      {ds.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{ds.provider}</td>
                  <td className="py-4 px-4 text-text-secondary">{ds.resolution}</td>
                  <td className="py-4 px-4 text-text-secondary">{ds.updateFrequency}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {ds.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="polar" size="sm">{ds.mode}</Badge>
                  </td>
                  <td className="py-4 px-4 text-right text-text-muted">
                    {new Date(ds.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
