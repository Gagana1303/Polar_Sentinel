import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { interpolateIcebergPosition } from '../utils/geo';
import {
  Radar, Activity, ShieldAlert, Navigation, Play, Compass, Ship,
  ArrowUpRight, Zap, Target, MapPin
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    setActiveTab, runFullSihDemo, icebergs, selectedIcebergId, selectIceberg,
    riskAssessment, routes, selectedRouteId, vessel, simulationTimeOffset,
  } = useAppStore();

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[2];
  const highRiskCount = icebergs.filter(i => i.riskLevel === 'high' || i.riskLevel === 'critical').length;
  const safetyScore = Math.max(0, 100 - riskAssessment.overallScore);
  const selectedIceberg = icebergs.find(i => i.id === selectedIcebergId) || icebergs[0];
  const currentPos = interpolateIcebergPosition(selectedIceberg, simulationTimeOffset);

  const kpiCards = [
    {
      label: 'ACTIVE ICEBERGS',
      value: String(icebergs.length).padStart(2, '0'),
      icon: <Radar size={18} />,
      color: '#38bdf8',
      desc: 'Tracked Objects',
    },
    {
      label: 'TRAJECTORIES',
      value: String(icebergs.length * 4).padStart(2, '0'),
      icon: <Activity size={18} />,
      color: '#0ea5e9',
      desc: '6h–72h Predictions',
    },
    {
      label: 'HIGH-RISK ZONES',
      value: String(highRiskCount).padStart(2, '0'),
      icon: <ShieldAlert size={18} />,
      color: highRiskCount > 0 ? '#ef4444' : '#22c55e',
      desc: 'Clearance < 15 NM',
    },
    {
      label: 'NAV SAFETY',
      value: `${safetyScore}%`,
      icon: <Navigation size={18} />,
      color: safetyScore >= 70 ? '#22c55e' : '#f59e0b',
      desc: `Via ${selectedRoute.code}`,
    },
  ];

  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(56,189,248,0.04) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.1)',
        borderRadius: 12,
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <Compass size={200} strokeWidth={1} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.2em', marginBottom: 8, textTransform: 'uppercase' }}>
            SIH 2026 • DECISION SUPPORT PLATFORM
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Antarctic Maritime Intelligence
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 18px', lineHeight: 1.6 }}>
            AI-powered monitoring, trajectory prediction and navigation decision support for Antarctic operations.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setActiveTab('navigation')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                border: 'none', color: 'white', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.06em',
                boxShadow: '0 0 15px rgba(14,165,233,0.3)',
              }}
            >
              <Navigation size={13} /> ENTER LIVE OPERATIONS
            </button>
            <button
              onClick={() => setActiveTab('ai-predictions')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                color: '#7dd3fc', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.06em',
              }}
            >
              <Zap size={13} /> RUN AI ANALYSIS
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="glass-card glass-card-hover" style={{ padding: '16px 18px', cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em' }}>{kpi.label}</span>
              <div style={{ color: kpi.color, opacity: 0.7 }}>{kpi.icon}</div>
            </div>
            <div className="metric-value" style={{ fontSize: 28, color: kpi.color, lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Content: Map + Intelligence Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, flex: 1, minHeight: 420 }}>
        {/* Map */}
        <div className="glass-card" style={{ overflow: 'hidden', minHeight: 400 }}>
          <AntarcticMap height="100%" />
        </div>

        {/* Intelligence Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Critical Intelligence */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 12 }}>
              CRITICAL INTELLIGENCE
            </div>

            {/* Selected Iceberg */}
            <div style={{
              padding: 12, borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.08)',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{selectedIceberg.name}</span>
                <span className={`risk-${selectedIceberg.riskLevel}`} style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase',
                }}>
                  {selectedIceberg.riskLevel}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
                <div><span style={{ color: '#64748b' }}>Status:</span> <span style={{ color: '#38bdf8', fontWeight: 600 }}>TRACKING</span></div>
                <div><span style={{ color: '#64748b' }}>Speed:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{currentPos.speedKnots} kn</span></div>
                <div><span style={{ color: '#64748b' }}>Heading:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{currentPos.headingDeg}°</span></div>
                <div><span style={{ color: '#64748b' }}>Confidence:</span> <span style={{ color: '#38bdf8', fontWeight: 600 }}>{selectedIceberg.confidencePercent}%</span></div>
              </div>
              <button
                onClick={() => { selectIceberg(selectedIceberg.id); setActiveTab('tracking'); }}
                style={{
                  width: '100%', marginTop: 10, padding: '6px 10px', borderRadius: 6,
                  background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(56,189,248,0.15)',
                  color: '#38bdf8', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                VIEW TRAJECTORY →
              </button>
            </div>
          </div>

          {/* Research Vessel */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
              RESEARCH VESSEL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ship size={16} color="#0ea5e9" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{vessel.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
              <div><span style={{ color: '#64748b' }}>Speed:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.speedKnots} kn</span></div>
              <div><span style={{ color: '#64748b' }}>Heading:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.headingDeg}°</span></div>
              <div><span style={{ color: '#64748b' }}>Class:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.vesselClass}</span></div>
              <div><span style={{ color: '#64748b' }}>ETA:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.etaDaysHours}</span></div>
            </div>
            <div style={{ marginTop: 8, padding: '6px 8px', borderRadius: 6, background: 'rgba(14,165,233,0.06)', fontSize: 10, color: '#7dd3fc' }}>
              <MapPin size={10} style={{ display: 'inline', marginRight: 4 }} />
              {vessel.destination}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
              RISK ASSESSMENT
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['low', 'medium', 'high'] as const).map(level => (
                <div key={level} style={{
                  flex: 1, padding: '8px 0', borderRadius: 6, textAlign: 'center',
                  background: riskAssessment.riskLevel === level ? `${level === 'low' ? '#22c55e' : level === 'medium' ? '#f59e0b' : '#ef4444'}15` : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${riskAssessment.riskLevel === level ? (level === 'low' ? 'rgba(34,197,94,0.2)' : level === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(56,189,248,0.05)'}`,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    color: level === 'low' ? '#4ade80' : level === 'medium' ? '#fbbf24' : '#f87171',
                    opacity: riskAssessment.riskLevel === level ? 1 : 0.4,
                  }}>
                    {level === 'low' ? 'SAFE' : level === 'medium' ? 'CAUTION' : 'DANGER'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>
              {riskAssessment.recommendedAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
