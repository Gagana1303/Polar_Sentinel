import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { interpolateIcebergPosition, haversineDistanceNm } from '../utils/geo';
import { Activity, Clock, Target, ArrowRight, ChevronRight } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

export const TrajectoryTrackingPage: React.FC = () => {
  const {
    icebergs, selectedIcebergId, selectIceberg, vessel,
    routes, selectedRouteId, simulationTimeOffset, riskAssessment, setActiveTab,
  } = useAppStore();

  const [predictionHorizon, setPredictionHorizon] = useState<number>(24);
  const selectedIceberg = icebergs.find(i => i.id === selectedIcebergId) || icebergs[0];
  const currentPos = interpolateIcebergPosition(selectedIceberg, simulationTimeOffset);
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[2];

  // Distance to vessel
  const distToVessel = haversineDistanceNm(currentPos.lat, currentPos.lng, vessel.lat, vessel.lng);

  // Filter forecast by horizon
  const filteredForecast = selectedIceberg.forecastTrack.filter(
    pt => pt.timeOffsetHours <= predictionHorizon
  );

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Map (Left ~70%) */}
      <div style={{ flex: '0 0 70%', position: 'relative' }}>
        {/* Page title overlay */}
        <div style={{
          position: 'absolute', top: 12, left: 60, zIndex: 1000,
          background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8,
          padding: '8px 14px',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em' }}>
            ICEBERG KINEMATICS & TRAJECTORY TRACKING
          </div>
        </div>

        <AntarcticMap height="100%" showTrajectory={true} showRoutes={true} showRiskZones={true} />

        {/* Legend Overlay - Bottom Left */}
        <div style={{
          position: 'absolute', bottom: 40, left: 12, zIndex: 1000,
          background: 'rgba(10,14,26,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8,
          padding: '10px 14px', fontSize: 10, color: '#94a3b8',
        }}>
          <div style={{ fontWeight: 700, fontSize: 9, color: '#64748b', letterSpacing: '0.1em', marginBottom: 6 }}>
            TRAJECTORY LEGEND
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 2, background: '#64748b', borderTop: '2px dashed #64748b' }} />
              <span>Historical Path</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 3, background: '#38bdf8' }} />
              <span>Predicted Path</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 3, background: '#22c55e' }} />
              <span>Safe Route (AI Rec.)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 2, background: '#ef4444', borderTop: '2px dashed #ef4444' }} />
              <span>Risk Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px dashed #ef4444', opacity: 0.5 }} />
              <span>Collision Risk Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Panel (Right 30%) */}
      <div style={{
        flex: '0 0 30%', overflow: 'auto', padding: 16,
        borderLeft: '1px solid rgba(56,189,248,0.08)',
        background: 'rgba(10,14,26,0.6)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Iceberg Info */}
        <div className="glass-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em', marginBottom: 4 }}>
                TRACKING TARGET
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{selectedIceberg.name}</div>
            </div>
            <span className={`risk-${selectedIceberg.riskLevel}`} style={{
              fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase',
            }}>
              {selectedIceberg.riskLevel}
            </span>
          </div>
        </div>

        {/* Current Status */}
        <div className="glass-card" style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'POSITION', value: `${Math.abs(currentPos.lat).toFixed(3)}°S, ${currentPos.lng.toFixed(3)}°E`, color: '#e2e8f0' },
              { label: 'VELOCITY', value: `${currentPos.speedKnots} kn`, color: '#38bdf8' },
              { label: 'HEADING', value: `${currentPos.headingDeg}°`, color: '#e2e8f0' },
              { label: 'DIST TO VESSEL', value: `${distToVessel.toFixed(1)} NM`, color: distToVessel < 15 ? '#ef4444' : '#22c55e' },
              { label: 'RISK SCORE', value: `${riskAssessment.overallScore}/100`, color: RISK_COLORS[riskAssessment.riskLevel] },
              { label: 'CLEARANCE', value: `${riskAssessment.predictedMinClearanceNm} NM`, color: riskAssessment.predictedMinClearanceNm < 15 ? '#ef4444' : '#22c55e' },
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '8px 10px', borderRadius: 6,
                background: 'rgba(56,189,248,0.03)',
                border: '1px solid rgba(56,189,248,0.05)',
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 3 }}>
                  {item.label}
                </div>
                <div className="metric-value" style={{ fontSize: 14, color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Prediction Time Selector */}
        <div className="glass-card" style={{ padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            AI PREDICTION HORIZON
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[24, 48, 72].map(h => (
              <button
                key={h}
                onClick={() => setPredictionHorizon(h)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 6,
                  background: predictionHorizon === h ? 'rgba(14,165,233,0.15)' : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${predictionHorizon === h ? 'rgba(14,165,233,0.3)' : 'rgba(56,189,248,0.06)'}`,
                  color: predictionHorizon === h ? '#38bdf8' : '#64748b',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Points */}
        <div className="glass-card" style={{ padding: 14, flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            PREDICTED POSITIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredForecast.map((pt, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 6,
                background: pt.timeOffsetHours === 0 ? 'rgba(14,165,233,0.1)' : 'rgba(56,189,248,0.03)',
                border: `1px solid ${pt.timeOffsetHours === 0 ? 'rgba(14,165,233,0.2)' : 'rgba(56,189,248,0.04)'}`,
                fontSize: 10,
              }}>
                <span style={{ fontWeight: 700, color: pt.timeOffsetHours === 0 ? '#38bdf8' : '#94a3b8', width: 40 }}>
                  {pt.timeOffsetHours === 0 ? 'NOW' : `+${pt.timeOffsetHours}h`}
                </span>
                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>
                  {Math.abs(pt.lat).toFixed(2)}°S, {pt.lng.toFixed(2)}°E
                </span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>
                  {pt.speedKnots}kn @ {pt.headingDeg}°
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => setActiveTab('navigation')}
          style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            border: 'none', color: 'white', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          NAVIGATION RISK ANALYSIS <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
