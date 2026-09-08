import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { interpolateIcebergPosition } from '../utils/geo';
import { Radar, Navigation2, ShieldAlert, Zap, Waves, Wind, Snowflake, Target } from 'lucide-react';

export const IcebergIntelligencePage: React.FC = () => {
  const {
    icebergs, selectedIcebergId, selectIceberg, setActiveTab,
    simulationTimeOffset, riskAssessment, environment,
  } = useAppStore();

  const selectedIceberg = icebergs.find(i => i.id === selectedIcebergId) || icebergs[0];
  const currentPos = interpolateIcebergPosition(selectedIceberg, simulationTimeOffset);

  const RISK_COLORS: Record<string, string> = {
    low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Map (Left 60%) */}
      <div style={{ flex: '0 0 60%', position: 'relative' }}>
        <AntarcticMap height="100%" focusIceberg={selectedIcebergId} compact={false} />
        {/* Iceberg selector overlay */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1000,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {icebergs.map(ice => (
            <button
              key={ice.id}
              onClick={() => selectIceberg(ice.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 6,
                background: ice.id === selectedIcebergId ? 'rgba(56,189,248,0.15)' : 'rgba(10,14,26,0.9)',
                border: `1px solid ${ice.id === selectedIcebergId ? 'rgba(56,189,248,0.3)' : 'rgba(56,189,248,0.08)'}`,
                color: ice.id === selectedIcebergId ? '#38bdf8' : '#94a3b8',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: RISK_COLORS[ice.riskLevel],
              }} />
              {ice.id}
            </button>
          ))}
        </div>
      </div>

      {/* Intelligence Panel (Right 40%) */}
      <div style={{
        flex: '0 0 40%', overflow: 'auto', padding: 20,
        borderLeft: '1px solid rgba(56,189,248,0.08)',
        background: 'rgba(10,14,26,0.6)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', marginBottom: 6 }}>
            SELECTED ICEBERG
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            {selectedIceberg.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span className={`risk-${selectedIceberg.riskLevel}`} style={{
              fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase',
            }}>
              {selectedIceberg.riskLevel} RISK
            </span>
            <span style={{ fontSize: 10, color: '#64748b' }}>
              Status: <span style={{ color: '#38bdf8', fontWeight: 600 }}>ACTIVE TRACKING</span>
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="glass-card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 12 }}>
            PROPERTIES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Length', value: `${selectedIceberg.lengthMeters} m` },
              { label: 'Width', value: `${selectedIceberg.widthMeters} m` },
              { label: 'Height', value: `${selectedIceberg.heightMeters || '—'} m` },
              { label: 'Area', value: `${selectedIceberg.areaKm2} km²` },
              { label: 'Speed', value: `${currentPos.speedKnots} kn` },
              { label: 'Heading', value: `${currentPos.headingDeg}°` },
              { label: 'Position', value: `${Math.abs(currentPos.lat).toFixed(2)}°S` },
              { label: 'Longitude', value: `${currentPos.lng.toFixed(2)}°E` },
              { label: 'Confidence', value: `${selectedIceberg.confidencePercent}%` },
              { label: 'Last Seen', value: selectedIceberg.lastObservation.split('(')[1]?.replace(')', '') || 'Recent' },
            ].map((prop, idx) => (
              <div key={idx} style={{
                padding: '8px 10px', borderRadius: 6,
                background: 'rgba(56,189,248,0.03)',
                border: '1px solid rgba(56,189,248,0.05)',
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#64748b', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {prop.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                  {prop.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physics Attribution */}
        <div className="glass-card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 12 }}>
            WHY IT MOVES — PHYSICS ATTRIBUTION
          </div>
          {[
            { label: 'Ocean Currents', pct: selectedIceberg.physicsAttribution.oceanCurrentPercent, color: '#0ea5e9', icon: <Waves size={12} />, detail: `${environment.oceanCurrentSpeedMs} m/s` },
            { label: 'Wind Forcing', pct: selectedIceberg.physicsAttribution.windPercent, color: '#38bdf8', icon: <Wind size={12} />, detail: `${environment.windSpeedKnots} kn` },
            { label: 'Sea Ice Drag', pct: selectedIceberg.physicsAttribution.seaIcePercent, color: '#f59e0b', icon: <Snowflake size={12} />, detail: `${environment.seaIceConcentrationPercent}% pack` },
          ].map((attr, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontWeight: 500 }}>
                  <span style={{ color: attr.color }}>{attr.icon}</span>
                  {attr.label} ({attr.detail})
                </span>
                <span style={{ fontWeight: 700, color: attr.color }}>{attr.pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${attr.pct}%`, background: attr.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <div className="glass-card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            AI ANALYSIS
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 6px' }}>Trajectory indicates gradual drift movement at {currentPos.headingDeg}°.</p>
            <p style={{ margin: '0 0 6px' }}>
              {riskAssessment.riskLevel === 'low' || riskAssessment.riskLevel === 'medium'
                ? 'Current projected path does not critically intersect the vessel\'s planned route.'
                : 'Projected path corridor intersects vessel safety envelope. Route diversion recommended.'}
            </p>
            <p style={{ margin: 0, fontWeight: 600, color: RISK_COLORS[riskAssessment.riskLevel] }}>
              Risk Level: {riskAssessment.riskLevel.toUpperCase()} (Score: {riskAssessment.overallScore}/100)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { selectIceberg(selectedIceberg.id); setActiveTab('tracking'); }} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            border: 'none', color: 'white', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Navigation2 size={14} /> VIEW TRAJECTORY
          </button>
          <button onClick={() => setActiveTab('ai-predictions')} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.15)',
            color: '#7dd3fc', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Zap size={14} /> RUN AI PREDICTION
          </button>
          <button onClick={() => setActiveTab('navigation')} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.08)',
            color: '#94a3b8', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <ShieldAlert size={14} /> NAVIGATION ANALYSIS
          </button>
        </div>
      </div>
    </div>
  );
};
