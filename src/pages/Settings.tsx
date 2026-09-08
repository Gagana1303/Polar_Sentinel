import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings as SettingsIcon, Database, Wifi, Shield, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    dataMode, setDataMode, settings, updateSettings, dataSources,
  } = useAppStore();

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', marginBottom: 6 }}>
            SYSTEM SETTINGS
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Configuration & Data Sources
          </h1>
        </div>

        {/* Data Mode */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Wifi size={16} color="#38bdf8" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Data Mode</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['DEMO', 'LIVE'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDataMode(mode)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: dataMode === mode ? 'rgba(14,165,233,0.12)' : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${dataMode === mode ? 'rgba(14,165,233,0.25)' : 'rgba(56,189,248,0.06)'}`,
                  color: dataMode === mode ? '#38bdf8' : '#64748b',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {mode} MODE
              </button>
            ))}
          </div>
        </div>

        {/* Safety Parameters */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Shield size={16} color="#38bdf8" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Safety Parameters</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Minimum Safety Buffer', key: 'minSafetyBufferNm' as const, unit: 'NM', value: settings.minSafetyBufferNm },
              { label: 'Critical Clearance', key: 'criticalClearanceNm' as const, unit: 'NM', value: settings.criticalClearanceNm },
              { label: 'Stochastic Iterations', key: 'stochasticIterations' as const, unit: 'runs', value: settings.stochasticIterations },
            ].map(param => (
              <div key={param.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 8,
                background: 'rgba(56,189,248,0.03)',
                border: '1px solid rgba(56,189,248,0.05)',
              }}>
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{param.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="metric-value" style={{ fontSize: 16, color: '#38bdf8' }}>
                    {param.value}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{param.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Database size={16} color="#38bdf8" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Data Sources</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dataSources.map((ds, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 8,
                background: 'rgba(56,189,248,0.02)',
                border: '1px solid rgba(56,189,248,0.04)',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{ds.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{ds.provider} • {ds.resolution}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: ds.status === 'Operational' ? '#22c55e' : ds.status === 'Degraded' ? '#f59e0b' : '#ef4444',
                  }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: ds.status === 'Operational' ? '#4ade80' : '#f59e0b' }}>
                    {ds.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
