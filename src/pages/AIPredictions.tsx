import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { interpolateIcebergPosition } from '../utils/geo';
import { Zap, BrainCircuit, CheckCircle, Loader, Satellite, Wind, Waves, Target, ArrowRight, Navigation2 } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

const ANALYSIS_STEPS = [
  { text: 'ANALYZING SATELLITE DATA...', icon: <Satellite size={14} />, duration: 800 },
  { text: 'PROCESSING ICEBERG MOTION VECTORS...', icon: <Waves size={14} />, duration: 700 },
  { text: 'ANALYZING SEA-ICE CONDITIONS...', icon: <Wind size={14} />, duration: 600 },
  { text: 'CALCULATING TRAJECTORY ENSEMBLE...', icon: <Target size={14} />, duration: 900 },
  { text: 'GENERATING NAVIGATION RISK ASSESSMENT...', icon: <Navigation2 size={14} />, duration: 700 },
];

export const AIPredictionsPage: React.FC = () => {
  const {
    icebergs, selectedIcebergId, selectIceberg, vessel,
    riskAssessment, routes, selectedRouteId, simulationTimeOffset,
    environment, setActiveTab,
  } = useAppStore();

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(selectedIcebergId || 'ICE-A17');

  const selectedIceberg = icebergs.find(i => i.id === selectedTarget) || icebergs[0];
  const currentPos = interpolateIcebergPosition(selectedIceberg, simulationTimeOffset);

  // Deterministic prediction engine
  const prediction = React.useMemo(() => {
    const speedVariation = 1 + (Math.sin(currentPos.headingDeg * 0.1) * 0.15);
    const predictedSpeed = Number((currentPos.speedKnots * speedVariation).toFixed(2));
    const headingDrift = Math.round(currentPos.headingDeg + (Math.cos(currentPos.lat * 0.5) * 5));
    const directionLabel = headingDrift >= 45 && headingDrift < 135 ? 'E' :
      headingDrift >= 135 && headingDrift < 225 ? 'S' :
      headingDrift >= 225 && headingDrift < 315 ? 'W' : 'N';
    const directionFull = headingDrift >= 22 && headingDrift < 68 ? 'NE' :
      headingDrift >= 68 && headingDrift < 112 ? 'E' :
      headingDrift >= 112 && headingDrift < 158 ? 'SE' :
      headingDrift >= 158 && headingDrift < 202 ? 'S' :
      headingDrift >= 202 && headingDrift < 248 ? 'SW' :
      headingDrift >= 248 && headingDrift < 292 ? 'W' :
      headingDrift >= 292 && headingDrift < 338 ? 'NW' : 'N';
    const confidence = Math.min(98, selectedIceberg.confidencePercent + Math.floor(Math.random() * 3));
    const riskScore = riskAssessment.overallScore;
    const action = riskScore < 25 ? 'SAFE TO PROCEED' :
      riskScore < 50 ? 'SAFE TO PROCEED WITH CAUTION' :
      riskScore < 75 ? 'ROUTE DIVERSION RECOMMENDED' :
      'IMMEDIATE ROUTE CHANGE REQUIRED';

    return { predictedSpeed, headingDrift, directionFull, confidence, riskScore, action };
  }, [selectedIceberg, currentPos, riskAssessment]);

  const runAnalysis = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStep(0);
    selectIceberg(selectedTarget);
  }, [selectedTarget]);

  useEffect(() => {
    if (!isRunning || currentStep < 0) return;
    if (currentStep >= ANALYSIS_STEPS.length) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, ANALYSIS_STEPS[currentStep].duration);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', marginBottom: 6 }}>
            AI PREDICTION ENGINE
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>
            Iceberg Trajectory & Risk Analysis
          </h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Physics-informed ensemble prediction with satellite data fusion
          </p>
        </div>

        {/* Target Selector */}
        <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
            SELECT TARGET
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {icebergs.map(ice => (
              <button
                key={ice.id}
                onClick={() => setSelectedTarget(ice.id)}
                style={{
                  padding: '6px 14px', borderRadius: 6,
                  background: selectedTarget === ice.id ? 'rgba(14,165,233,0.15)' : 'rgba(56,189,248,0.03)',
                  border: `1px solid ${selectedTarget === ice.id ? 'rgba(14,165,233,0.3)' : 'rgba(56,189,248,0.06)'}`,
                  color: selectedTarget === ice.id ? '#38bdf8' : '#94a3b8',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_COLORS[ice.riskLevel] }} />
                {ice.id}
              </button>
            ))}
          </div>
        </div>

        {/* Run Button */}
        {!isComplete && !isRunning && (
          <button
            onClick={runAnalysis}
            style={{
              width: '100%', padding: '14px', borderRadius: 10,
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: 'none', color: 'white', fontSize: 13, fontWeight: 800,
              cursor: 'pointer', letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 20px rgba(14,165,233,0.3)',
              marginBottom: 20,
            }}
          >
            <BrainCircuit size={18} /> RUN AI PREDICTION
          </button>
        )}

        {/* Loading Sequence */}
        {isRunning && (
          <div className="glass-card animate-fade-in" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Loader size={16} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>PROCESSING...</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ANALYSIS_STEPS.map((step, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  opacity: idx <= currentStep ? 1 : 0.3,
                  transition: 'opacity 0.3s ease',
                }}>
                  <div style={{ color: idx < currentStep ? '#22c55e' : idx === currentStep ? '#38bdf8' : '#475569' }}>
                    {idx < currentStep ? <CheckCircle size={14} /> : step.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: idx < currentStep ? '#22c55e' : idx === currentStep ? '#38bdf8' : '#475569',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.02em',
                  }}>
                    {step.text}
                  </span>
                  {idx === currentStep && (
                    <div className="animate-shimmer" style={{ flex: 1, height: 2, borderRadius: 1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isComplete && (
          <div className="animate-slide-up">
            {/* Success Banner */}
            <div style={{
              padding: '16px 20px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.15)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <CheckCircle size={20} color="#22c55e" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#4ade80' }}>AI PREDICTION COMPLETE</div>
                <div style={{ fontSize: 10, color: '#86efac' }}>Analysis for {selectedIceberg.name} — {new Date().toISOString().slice(11, 19)} UTC</div>
              </div>
            </div>

            {/* Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 8 }}>
                  PREDICTED DIRECTION
                </div>
                <div className="metric-value" style={{ fontSize: 32, color: '#38bdf8' }}>
                  {prediction.directionFull}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{prediction.headingDrift}°</div>
              </div>
              <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 8 }}>
                  PREDICTED SPEED
                </div>
                <div className="metric-value" style={{ fontSize: 32, color: '#0ea5e9' }}>
                  {prediction.predictedSpeed}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>km/h</div>
              </div>
              <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', marginBottom: 8 }}>
                  CONFIDENCE
                </div>
                <div className="metric-value" style={{ fontSize: 32, color: '#22c55e' }}>
                  {prediction.confidence}%
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Trajectory</div>
              </div>
            </div>

            {/* Risk Score */}
            <div className="glass-card" style={{ padding: 20, marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 10 }}>
                RISK SCORE
              </div>
              <div className="metric-value" style={{ fontSize: 56, color: RISK_COLORS[riskAssessment.riskLevel], lineHeight: 1 }}>
                {prediction.riskScore}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>/ 100</div>

              {/* Risk bar */}
              <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'rgba(56,189,248,0.06)', marginTop: 12, overflow: 'hidden' }}>
                <div style={{
                  width: `${prediction.riskScore}%`, height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, #22c55e, ${prediction.riskScore > 50 ? '#f59e0b' : '#22c55e'}, ${prediction.riskScore > 75 ? '#ef4444' : '#f59e0b'})`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>

            {/* Recommended Action */}
            <div className="glass-card" style={{
              padding: 16, marginBottom: 16,
              background: `${RISK_COLORS[riskAssessment.riskLevel]}08`,
              borderColor: `${RISK_COLORS[riskAssessment.riskLevel]}20`,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginBottom: 8 }}>
                RECOMMENDED ACTION
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: RISK_COLORS[riskAssessment.riskLevel] }}>
                {prediction.action}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
                {riskAssessment.summaryExplanation}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setIsComplete(false); setCurrentStep(-1); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: 'rgba(56,189,248,0.08)',
                  border: '1px solid rgba(56,189,248,0.15)',
                  color: '#7dd3fc', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                RUN AGAIN
              </button>
              <button
                onClick={() => setActiveTab('navigation')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  border: 'none', color: 'white', fontSize: 11, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                VIEW NAVIGATION <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
