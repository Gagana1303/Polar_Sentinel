import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { Snowflake, Thermometer, Eye, Layers, TrendingDown, BarChart3 } from 'lucide-react';

// Demo sea-ice data grid
const SEA_ICE_ZONES = [
  { id: 'zone-1', name: 'Prydz Bay North', lat: -67.5, lng: 74.0, concentration: 8, thickness: 0.4, type: 'First-year', trend: 'decreasing' },
  { id: 'zone-2', name: 'Prydz Bay Central', lat: -68.0, lng: 74.5, concentration: 14, thickness: 0.7, type: 'First-year', trend: 'stable' },
  { id: 'zone-3', name: 'Mawson Coast', lat: -68.5, lng: 72.0, concentration: 22, thickness: 1.1, type: 'Multi-year', trend: 'increasing' },
  { id: 'zone-4', name: 'Davis Station Approach', lat: -68.6, lng: 78.0, concentration: 6, thickness: 0.3, type: 'Brash ice', trend: 'decreasing' },
  { id: 'zone-5', name: 'Southern Pack Ice', lat: -69.5, lng: 73.0, concentration: 45, thickness: 1.8, type: 'Multi-year', trend: 'stable' },
  { id: 'zone-6', name: 'Ice Shelf Edge', lat: -69.0, lng: 76.0, concentration: 62, thickness: 2.5, type: 'Fast ice', trend: 'stable' },
  { id: 'zone-7', name: 'Open Water Corridor', lat: -67.8, lng: 76.5, concentration: 3, thickness: 0.1, type: 'Nilas', trend: 'decreasing' },
  { id: 'zone-8', name: 'West Sector', lat: -68.3, lng: 70.5, concentration: 18, thickness: 0.9, type: 'First-year', trend: 'increasing' },
];

const getConcentrationColor = (pct: number) => {
  if (pct < 10) return '#0ea5e9';
  if (pct < 20) return '#38bdf8';
  if (pct < 35) return '#7dd3fc';
  if (pct < 50) return '#f59e0b';
  if (pct < 70) return '#fb923c';
  return '#ef4444';
};

export const SeaIcePage: React.FC = () => {
  const { environment } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('concentration');

  const filters = [
    { id: 'concentration', label: 'Sea Ice Concentration', icon: <Snowflake size={14} /> },
    { id: 'thickness', label: 'Thickness', icon: <Layers size={14} /> },
    { id: 'edge', label: 'Ice Edge', icon: <TrendingDown size={14} /> },
    { id: 'visibility', label: 'Visibility', icon: <Eye size={14} /> },
  ];

  const avgConcentration = Math.round(SEA_ICE_ZONES.reduce((s, z) => s + z.concentration, 0) / SEA_ICE_ZONES.length);
  const avgThickness = (SEA_ICE_ZONES.reduce((s, z) => s + z.thickness, 0) / SEA_ICE_ZONES.length).toFixed(1);
  const maxConcentration = Math.max(...SEA_ICE_ZONES.map(z => z.concentration));
  const iceEdgeZones = SEA_ICE_ZONES.filter(z => z.concentration > 15 && z.concentration < 50).length;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Map */}
      <div style={{ flex: '0 0 60%', position: 'relative' }}>
        <AntarcticMap height="100%" showTrajectory={false} showRiskZones={false} compact={true} />
        <div style={{
          position: 'absolute', top: 12, left: 60, zIndex: 1000,
          background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8,
          padding: '8px 14px',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em' }}>
            SEA-ICE CONCENTRATION MONITOR
          </div>
        </div>
      </div>

      {/* Panel */}
      <div style={{
        flex: '0 0 40%', overflow: 'auto', padding: 20,
        borderLeft: '1px solid rgba(56,189,248,0.08)',
        background: 'rgba(10,14,26,0.6)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'AVG CONCENTRATION', value: `${avgConcentration}%`, color: '#38bdf8' },
            { label: 'AVG THICKNESS', value: `${avgThickness} m`, color: '#0ea5e9' },
            { label: 'MAX CONCENTRATION', value: `${maxConcentration}%`, color: '#f59e0b' },
            { label: 'ICE EDGE ZONES', value: String(iceEdgeZones), color: '#7dd3fc' },
          ].map((kpi, idx) => (
            <div key={idx} className="glass-card" style={{ padding: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 4 }}>
                {kpi.label}
              </div>
              <div className="metric-value" style={{ fontSize: 22, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            VISUALIZATION FILTER
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 6,
                  background: selectedFilter === f.id ? 'rgba(14,165,233,0.15)' : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${selectedFilter === f.id ? 'rgba(14,165,233,0.3)' : 'rgba(56,189,248,0.06)'}`,
                  color: selectedFilter === f.id ? '#38bdf8' : '#64748b',
                  fontSize: 10, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="glass-card" style={{ padding: 14, flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            SEA-ICE ZONES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SEA_ICE_ZONES.map(zone => (
              <div key={zone.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                background: 'rgba(56,189,248,0.02)',
                border: '1px solid rgba(56,189,248,0.04)',
              }}>
                {/* Concentration indicator */}
                <div style={{
                  width: 8, height: 28, borderRadius: 4,
                  background: getConcentrationColor(zone.concentration),
                  opacity: 0.8,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>
                    {zone.name}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                    <span><span style={{ color: '#64748b' }}>Conc:</span> <span style={{ fontWeight: 600, color: getConcentrationColor(zone.concentration) }}>{zone.concentration}%</span></span>
                    <span><span style={{ color: '#64748b' }}>Thick:</span> <span style={{ fontWeight: 600 }}>{zone.thickness}m</span></span>
                    <span style={{ color: '#64748b', fontSize: 9 }}>{zone.type}</span>
                  </div>
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 600,
                  color: zone.trend === 'increasing' ? '#f59e0b' : zone.trend === 'decreasing' ? '#22c55e' : '#64748b',
                }}>
                  {zone.trend === 'increasing' ? '↑' : zone.trend === 'decreasing' ? '↓' : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="glass-card" style={{ padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            ENVIRONMENTAL CONDITIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
            <div><span style={{ color: '#64748b' }}>SST:</span> <span style={{ color: '#38bdf8', fontWeight: 600 }}>{environment.seaSurfaceTempC}°C</span></div>
            <div><span style={{ color: '#64748b' }}>Wave:</span> <span style={{ fontWeight: 600 }}>{environment.waveHeightMeters}m</span></div>
            <div><span style={{ color: '#64748b' }}>Wind:</span> <span style={{ fontWeight: 600 }}>{environment.windSpeedKnots} kn @ {environment.windDirDeg}°</span></div>
            <div><span style={{ color: '#64748b' }}>Current:</span> <span style={{ fontWeight: 600 }}>{environment.oceanCurrentSpeedMs} m/s</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
