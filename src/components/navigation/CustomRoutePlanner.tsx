import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { routeOptimizationService } from '../../services/routeOptimizationService';
import { Compass, Navigation, ShieldCheck, AlertCircle, Sparkles, MapPin, ArrowRight } from 'lucide-react';

const ANTARCTIC_PRESETS = [
  {
    name: 'Mawson ➔ Davis Station',
    start: { name: 'Mawson Station', lat: -67.60, lng: 62.87 },
    dest: { name: 'Davis Station', lat: -68.58, lng: 77.97 },
  },
  {
    name: 'Prydz Bay ➔ Casey Station',
    start: { name: 'Prydz Bay Sector', lat: -67.85, lng: 72.50 },
    dest: { name: 'Casey Station', lat: -66.28, lng: 110.53 },
  },
  {
    name: 'Zhongshan ➔ Bharati Station',
    start: { name: 'Zhongshan Station', lat: -69.37, lng: 76.38 },
    dest: { name: 'Bharati Station (India)', lat: -69.41, lng: 76.19 },
  },
  {
    name: 'Larsemann Hills ➔ Amery Shelf',
    start: { name: 'Larsemann Hills', lat: -69.40, lng: 76.00 },
    dest: { name: 'Amery Ice Shelf Edge', lat: -68.20, lng: 73.50 },
  }
];

export const CustomRoutePlanner: React.FC = () => {
  const { icebergs, setCustomRoutes, selectedRouteId, routes } = useAppStore();

  const [startLat, setStartLat] = useState<number>(-67.85);
  const [startLng, setStartLng] = useState<number>(72.50);
  const [destLat, setDestLat] = useState<number>(-69.00);
  const [destLng, setDestLng] = useState<number>(76.20);
  const [sourceName, setSourceName] = useState<string>('Prydz Bay Sector (Source)');
  const [destName, setDestName] = useState<string>('Amery Outflow (Destination)');

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [lastPlannedSafest, setLastPlannedSafest] = useState<any>(null);

  const handleApplyPreset = (preset: typeof ANTARCTIC_PRESETS[0]) => {
    setStartLat(preset.start.lat);
    setStartLng(preset.start.lng);
    setDestLat(preset.dest.lat);
    setDestLng(preset.dest.lng);
    setSourceName(preset.start.name);
    setDestName(preset.dest.name);
  };

  const handleCalculateSafestRoute = async () => {
    setIsCalculating(true);
    try {
      const result = await routeOptimizationService.planCustomRoute(
        startLat,
        startLng,
        destLat,
        destLng,
        icebergs
      );

      setCustomRoutes(result.routes, result.safestRoute.id);
      setLastPlannedSafest(result.safestRoute);
    } catch (err) {
      console.error('Failed to compute safest route', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const activeSafest = lastPlannedSafest || routes.find(r => r.isRecommended) || routes[2];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(15,23,42,0.9) 100%)',
      border: '1px solid rgba(56,189,248,0.25)',
      borderRadius: 12,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(56,189,248,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Navigation size={15} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
              Dynamic Route Optimizer
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>
              Custom Origin & Destination • Live Risk Scoring
            </div>
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 9999,
          background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)',
          letterSpacing: '0.05em'
        }}>
          LIVE A* READY
        </span>
      </div>

      {/* Quick Presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ANTARCTIC_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset)}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(56,189,248,0.06)',
              border: '1px solid rgba(56,189,248,0.15)',
              color: '#cbd5e1',
              fontSize: 10,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.06)')}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Inputs: Source & Destination */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Source Box */}
        <div style={{
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: 8,
          padding: '8px 10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <MapPin size={12} color="#38bdf8" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8' }}>ORIGIN (SOURCE)</span>
          </div>
          <input
            type="text"
            value={sourceName}
            onChange={e => setSourceName(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(56,189,248,0.2)',
              color: '#f1f5f9', fontSize: 11, marginBottom: 6, outline: 'none', paddingBottom: 2
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 8, color: '#64748b' }}>LAT:</span>
              <input
                type="number"
                step="0.01"
                value={startLat}
                onChange={e => setStartLat(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%', background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(56,189,248,0.1)',
                  borderRadius: 4, color: '#e2e8f0', fontSize: 11, padding: '2px 4px', outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 8, color: '#64748b' }}>LNG:</span>
              <input
                type="number"
                step="0.01"
                value={startLng}
                onChange={e => setStartLng(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%', background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(56,189,248,0.1)',
                  borderRadius: 4, color: '#e2e8f0', fontSize: 11, padding: '2px 4px', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Destination Box */}
        <div style={{
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: 8,
          padding: '8px 10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <MapPin size={12} color="#4ade80" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80' }}>DESTINATION</span>
          </div>
          <input
            type="text"
            value={destName}
            onChange={e => setDestName(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(56,189,248,0.2)',
              color: '#f1f5f9', fontSize: 11, marginBottom: 6, outline: 'none', paddingBottom: 2
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 8, color: '#64748b' }}>LAT:</span>
              <input
                type="number"
                step="0.01"
                value={destLat}
                onChange={e => setDestLat(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%', background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(56,189,248,0.1)',
                  borderRadius: 4, color: '#e2e8f0', fontSize: 11, padding: '2px 4px', outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 8, color: '#64748b' }}>LNG:</span>
              <input
                type="number"
                step="0.01"
                value={destLng}
                onChange={e => setDestLng(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%', background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(56,189,248,0.1)',
                  borderRadius: 4, color: '#e2e8f0', fontSize: 11, padding: '2px 4px', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Safest Route Action Button */}
      <button
        onClick={handleCalculateSafestRoute}
        disabled={isCalculating}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          background: isCalculating ? '#0369a1' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          border: '1px solid rgba(56,189,248,0.4)',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.05em',
          cursor: isCalculating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        <Sparkles size={16} />
        {isCalculating ? 'COMPUTING A* SAFEST TRAJECTORY...' : 'COMPUTE SAFEST OPTIMIZED ROUTE'}
      </button>

      {/* Result Card — Safest Route Display */}
      {activeSafest && (
        <div style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#4ade80" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>
                SAFEST ROUTE: {activeSafest.code}
              </span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
              background: 'rgba(34,197,94,0.2)', color: '#86efac'
            }}>
              RISK SCORE: {activeSafest.riskScore}/100 ({activeSafest.riskLevel.toUpperCase()})
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#cbd5e1' }}>
            <span><strong>Distance:</strong> {activeSafest.distanceNm} NM</span>
            <span><strong>ETA:</strong> {activeSafest.etaDaysHours}</span>
            <span><strong>Min Clearance:</strong> {activeSafest.minimumClearanceNm} NM</span>
            <span><strong>Fuel:</strong> {activeSafest.fuelEstimateTonnes} T</span>
          </div>

          <div style={{ fontSize: 9.5, color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid rgba(34,197,94,0.15)', paddingTop: 4 }}>
            ✓ {activeSafest.explanation || activeSafest.recommendationReason}
          </div>
        </div>
      )}
    </div>
  );
};
