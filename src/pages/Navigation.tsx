import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { Ship, Navigation2, ShieldAlert, Fuel, Clock, Target, Route, ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CustomRoutePlanner } from '../components/navigation/CustomRoutePlanner';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

export const NavigationPage: React.FC = () => {
  const {
    vessel, routes, selectedRouteId, selectRoute,
    riskAssessment, icebergs, environment, setActiveTab,
  } = useAppStore();

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[2];

  const riskFactors = [
    { label: 'Iceberg Proximity', value: riskAssessment.predictedMinClearanceNm + ' NM', level: riskAssessment.predictedMinClearanceNm < 15 ? 'high' : 'low' },
    { label: 'Sea-Ice Concentration', value: environment.seaIceConcentrationPercent + '%', level: environment.seaIceConcentrationPercent > 20 ? 'medium' : 'low' },
    { label: 'Predicted Iceberg Movement', value: 'Active Drift', level: 'medium' },
    { label: 'Weather Conditions', value: `${environment.windSpeedKnots} kn wind`, level: environment.windSpeedKnots > 25 ? 'high' : 'low' },
    { label: 'Route Safety', value: `Score: ${100 - activeRoute.riskScore}`, level: activeRoute.riskLevel },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: Map + Route Comparison */}
      <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column' }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <AntarcticMap height="100%" showRoutes={true} showRiskZones={true} />
          <div style={{
            position: 'absolute', top: 12, left: 60, zIndex: 1000,
            background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8,
            padding: '8px 14px',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em' }}>
              NAVIGATION DECISION SUPPORT
            </div>
          </div>
        </div>

        {/* Route Comparison Cards */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(56,189,248,0.08)',
          background: 'rgba(10,14,26,0.8)',
          display: 'flex', gap: 10,
        }}>
          {routes.map(route => {
            const isActive = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => selectRoute(route.id)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 8,
                  background: isActive ? 'rgba(14,165,233,0.1)' : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${isActive ? 'rgba(14,165,233,0.25)' : 'rgba(56,189,248,0.06)'}`,
                  cursor: 'pointer', textAlign: 'left',
                  color: '#e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#38bdf8' : '#94a3b8' }}>
                    {route.code}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {route.isRecommended && (
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 9999, background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                        AI REC
                      </span>
                    )}
                    <span className={`risk-${route.riskLevel}`} style={{
                      fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 9999, textTransform: 'uppercase',
                    }}>
                      {route.riskLevel}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>{route.name}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                  <span><span style={{ color: '#64748b' }}>Dist:</span> <span style={{ fontWeight: 600 }}>{route.distanceNm} NM</span></span>
                  <span><span style={{ color: '#64748b' }}>ETA:</span> <span style={{ fontWeight: 600 }}>{route.etaDaysHours}</span></span>
                  <span><span style={{ color: '#64748b' }}>Risk:</span> <span style={{ fontWeight: 600, color: RISK_COLORS[route.riskLevel] }}>{route.riskScore}</span></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: '0 0 40%', overflow: 'auto', padding: 20,
        borderLeft: '1px solid rgba(56,189,248,0.08)',
        background: 'rgba(10,14,26,0.6)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Dynamic Custom Route Planner */}
        <CustomRoutePlanner />

        {/* Current Vessel */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 12 }}>
            CURRENT VESSEL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ship size={18} color="#0ea5e9" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{vessel.name}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{vessel.vesselClass} • {vessel.type}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.05)' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: '0.08em' }}>SPEED</div>
              <div className="metric-value" style={{ fontSize: 16, color: '#e2e8f0' }}>{vessel.speedKnots} kn</div>
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.05)' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: '0.08em' }}>HEADING</div>
              <div className="metric-value" style={{ fontSize: 16, color: '#e2e8f0' }}>{vessel.headingDeg}°</div>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 6, background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.08)', fontSize: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#64748b' }}>Origin (Source):</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>-68.51°S, 72.80°E (Prydz Bay)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Destination:</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>-68.58°S, 77.96°E (Mawson Station)</span>
            </div>
          </div>
        </div>

        {/* Navigation Risk */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em' }}>
              NAVIGATION RISK
            </div>
            <div className={`risk-${riskAssessment.riskLevel}`} style={{
              fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 9999, textTransform: 'uppercase',
            }}>
              {riskAssessment.riskLevel}
            </div>
          </div>

          {/* Risk Score Gauge */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div className="metric-value" style={{ fontSize: 42, color: RISK_COLORS[riskAssessment.riskLevel] }}>
              {riskAssessment.overallScore}
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>/ 100 Risk Score</div>
          </div>

          {/* Risk Factors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {riskFactors.map((factor, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 6,
                background: 'rgba(56,189,248,0.02)',
                border: '1px solid rgba(56,189,248,0.04)',
                fontSize: 11,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                  {factor.level === 'low' ? <CheckCircle size={12} color="#22c55e" /> :
                   factor.level === 'medium' ? <AlertTriangle size={12} color="#f59e0b" /> :
                   <XCircle size={12} color="#ef4444" />}
                  {factor.label}
                </div>
                <span style={{ fontWeight: 600, color: RISK_COLORS[factor.level] }}>{factor.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Route Details & Waypoints */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            ACTIVE ROUTE: {activeRoute.code} — WAYPOINTS ({activeRoute.points.length} POINTS)
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
            {activeRoute.explanation}
          </div>
          
          {/* Waypoint Coordinates List */}
          <div style={{
            marginBottom: 12, padding: '8px 10px', borderRadius: 6,
            background: 'rgba(10,14,26,0.6)', border: '1px solid rgba(56,189,248,0.08)',
            display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 110, overflowY: 'auto',
          }}>
            {activeRoute.points.map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                <span style={{ color: idx === 0 ? '#38bdf8' : idx === activeRoute.points.length - 1 ? '#22c55e' : '#64748b', fontWeight: 700 }}>
                  {idx === 0 ? 'START' : idx === activeRoute.points.length - 1 ? 'DEST' : `WP ${idx}`}
                </span>
                <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>
                  Lat: {pt[1].toFixed(2)}°S, Lng: {pt[0].toFixed(2)}°E
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: activeRoute.isRecommended ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${activeRoute.isRecommended ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
            fontSize: 11, fontWeight: 600,
            color: activeRoute.isRecommended ? '#4ade80' : '#f87171',
          }}>
            {activeRoute.isRecommended ? '✓ ' : '⚠ '}{activeRoute.recommendationReason}
          </div>
        </div>

        {/* Generate Safest Route */}
        <button
          onClick={() => {
            selectRoute('ROUTE_C');
          }}
          style={{
            width: '100%', padding: '12px', borderRadius: 8,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none', color: 'white', fontSize: 12, fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 0 15px rgba(34,197,94,0.2)',
          }}
        >
          <Route size={15} /> GENERATE SAFEST ROUTE
        </button>
      </div>
    </div>
  );
};
