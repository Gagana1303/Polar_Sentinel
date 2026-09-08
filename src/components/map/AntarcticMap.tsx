import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../../store/useAppStore';
import { interpolateIcebergPosition, interpolateVesselPosition } from '../../utils/geo';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

function createIcebergIcon(risk: string, isSelected: boolean, label: string) {
  const color = RISK_COLORS[risk] || '#22c55e';
  const size = isSelected ? 28 : 20;
  const borderSize = isSelected ? 3 : 2;
  const glowSize = isSelected ? size + 16 : 0;

  return L.divIcon({
    className: 'iceberg-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        ${isSelected ? `<div style="position:absolute;width:${glowSize}px;height:${glowSize}px;border-radius:50%;background:${color};opacity:0.15;animation:pulse-ring 2s ease-in-out infinite;"></div>` : ''}
        ${isSelected ? `<div style="position:absolute;width:${size+8}px;height:${size+8}px;border-radius:50%;border:1px solid ${color};opacity:0.4;"></div>` : ''}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${borderSize}px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;font-size:${isSelected ? 10 : 8}px;font-weight:800;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.3),0 0 12px ${color}40;transition:transform 0.2s;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [size + 16, size + 16],
    iconAnchor: [(size + 16) / 2, (size + 16) / 2],
  });
}

function createVesselIcon(heading: number) {
  return L.divIcon({
    className: 'vessel-marker',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;transform:rotate(${heading}deg);">
        <div style="width:28px;height:28px;border-radius:50%;background:#0ea5e9;border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(14,165,233,0.4),0 0 20px rgba(14,165,233,0.2);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Component to handle map events and auto-fly
function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1 });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Fix map size on mount
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, []);

  return null;
}

interface AntarcticMapProps {
  height?: string;
  showControls?: boolean;
  focusIceberg?: string | null;
  showTrajectory?: boolean;
  showRoutes?: boolean;
  showRiskZones?: boolean;
  showVessel?: boolean;
  compact?: boolean;
}

export const AntarcticMap: React.FC<AntarcticMapProps> = ({
  height = '100%',
  showControls = true,
  focusIceberg,
  showTrajectory = true,
  showRoutes = true,
  showRiskZones = true,
  showVessel = true,
  compact = false,
}) => {
  const {
    icebergs,
    selectedIcebergId,
    selectIceberg,
    vessel,
    routes,
    selectedRouteId,
    simulationTimeOffset,
    setActiveTab,
  } = useAppStore();

  const selectedIceberg = icebergs.find(i => i.id === (focusIceberg || selectedIcebergId)) || icebergs[0];
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[2];

  const vesselPos = useMemo(
    () => interpolateVesselPosition(vessel, activeRoute, simulationTimeOffset),
    [vessel, activeRoute, simulationTimeOffset]
  );

  const icebergPositions = useMemo(
    () => icebergs.map(ice => ({
      ...ice,
      currentPos: interpolateIcebergPosition(ice, simulationTimeOffset),
    })),
    [icebergs, simulationTimeOffset]
  );

  // Map center - focus on selected iceberg or Antarctic default
  const mapCenter: [number, number] = selectedIceberg
    ? [selectedIceberg.lat, selectedIceberg.lng]
    : [-68.5, 74.5];

  // Map tile layer providers (100% free, no API key required)
  const TILE_PROVIDERS = {
    dark: {
      name: 'Dark Ops',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    },
    satellite: {
      name: 'Real Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, USDA, USGS',
      maxZoom: 18,
    },
    ocean: {
      name: 'Bathymetry Ocean',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; GEBCO, NOAA, CHS, National Geographic, DeLorme',
      maxZoom: 13,
    },
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
  };

  const [providerKey, setProviderKey] = React.useState<keyof typeof TILE_PROVIDERS>('satellite');
  const activeTileProvider = TILE_PROVIDERS[providerKey];

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      {/* Map Tile Layer Selector Button */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1000,
        display: 'flex',
        gap: '4px',
        background: 'rgba(10, 14, 26, 0.92)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '8px',
        padding: '4px',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
      }}>
        {(Object.keys(TILE_PROVIDERS) as Array<keyof typeof TILE_PROVIDERS>).map(key => (
          <button
            key={key}
            onClick={() => setProviderKey(key)}
            style={{
              padding: '5px 10px',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.15s ease',
              background: providerKey === key ? '#0ea5e9' : 'transparent',
              color: providerKey === key ? '#ffffff' : '#94a3b8',
            }}
          >
            {TILE_PROVIDERS[key].name}
          </button>
        ))}
      </div>

      <MapContainer
        center={[-68.45, 74.5]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={showControls}
        attributionControl={true}
        maxZoom={activeTileProvider.maxZoom}
        minZoom={3}
      >
        {/* Real tile layer without API key requirement */}
        <TileLayer
          key={providerKey}
          url={activeTileProvider.url}
          attribution={activeTileProvider.attribution}
          maxZoom={activeTileProvider.maxZoom}
        />

        <MapController center={undefined} zoom={undefined} />

        {/* Vessel Marker */}
        {showVessel && (
          <Marker
            position={[vesselPos.lat, vesselPos.lng]}
            icon={createVesselIcon(vesselPos.headingDeg)}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: '200px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Research Vessel
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
                  {vessel.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                  <div><span style={{ color: '#64748b' }}>Speed:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.speedKnots} kn</span></div>
                  <div><span style={{ color: '#64748b' }}>Heading:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vesselPos.headingDeg}°</span></div>
                  <div><span style={{ color: '#64748b' }}>Class:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vessel.vesselClass}</span></div>
                  <div><span style={{ color: '#64748b' }}>Route:</span> <span style={{ color: '#22c55e', fontWeight: 600 }}>{activeRoute.code}</span></div>
                </div>
                <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(14,165,233,0.1)', borderRadius: '6px', fontSize: '10px', color: '#7dd3fc' }}>
                  Destination: {vessel.destination}
                </div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
              <span style={{ fontWeight: 600, fontSize: '11px' }}>{vessel.name}</span>
            </Tooltip>
          </Marker>
        )}

        {/* Iceberg Markers */}
        {icebergPositions.map(ice => {
          const isSelected = ice.id === (focusIceberg || selectedIcebergId);
          const label = ice.id.split('-')[1] || ice.id;

          return (
            <Marker
              key={ice.id}
              position={[ice.currentPos.lat, ice.currentPos.lng]}
              icon={createIcebergIcon(ice.riskLevel, isSelected, label)}
              eventHandlers={{
                click: () => selectIceberg(ice.id),
              }}
            >
              <Popup>
                <div style={{ padding: '12px 14px', minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {ice.detectionSource}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: `${RISK_COLORS[ice.riskLevel]}20`,
                      color: RISK_COLORS[ice.riskLevel],
                      textTransform: 'uppercase',
                    }}>
                      {ice.riskLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
                    {ice.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '11px' }}>
                    <div><span style={{ color: '#64748b' }}>Speed:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{ice.currentPos.speedKnots} kn</span></div>
                    <div><span style={{ color: '#64748b' }}>Heading:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{ice.currentPos.headingDeg}°</span></div>
                    <div><span style={{ color: '#64748b' }}>Size:</span> <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{ice.lengthMeters}m</span></div>
                    <div><span style={{ color: '#64748b' }}>Confidence:</span> <span style={{ color: '#38bdf8', fontWeight: 600 }}>{ice.confidencePercent}%</span></div>
                  </div>
                  <button
                    onClick={() => {
                      selectIceberg(ice.id);
                      setActiveTab('tracking');
                    }}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '6px 10px',
                      background: 'rgba(14,165,233,0.15)',
                      border: '1px solid rgba(56,189,248,0.2)',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    View Intelligence →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Routes */}
        {showRoutes && routes.map(route => {
          const positions = route.points.map(p => [p[1], p[0]] as [number, number]);
          const isActive = route.id === selectedRouteId;

          return (
            <Polyline
              key={route.id}
              positions={positions}
              pathOptions={{
                color: isActive ? '#22c55e' : route.riskLevel === 'high' ? '#ef4444' : route.riskLevel === 'medium' ? '#f59e0b' : '#64748b',
                weight: isActive ? 4 : 2,
                opacity: isActive ? 0.9 : 0.5,
                dashArray: isActive ? undefined : '8 6',
              }}
            >
              <Tooltip sticky>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>
                  {route.name} {route.isRecommended ? '✓ AI Recommended' : `(Risk: ${route.riskScore})`}
                </span>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Historical Track for selected iceberg */}
        {showTrajectory && selectedIceberg && (
          <>
            <Polyline
              positions={selectedIceberg.historicalTrack.map(pt => [pt.lat, pt.lng] as [number, number])}
              pathOptions={{
                color: '#64748b',
                weight: 2,
                dashArray: '4 4',
                opacity: 0.6,
              }}
            />
            {/* Forecast Track */}
            <Polyline
              positions={selectedIceberg.forecastTrack.map(pt => [pt.lat, pt.lng] as [number, number])}
              pathOptions={{
                color: '#38bdf8',
                weight: 3,
                opacity: 0.8,
              }}
            />
            {/* Forecast point markers */}
            {selectedIceberg.forecastTrack.map((pt, idx) => (
              idx > 0 ? (
                <Circle
                  key={`fc-${idx}`}
                  center={[pt.lat, pt.lng]}
                  radius={500}
                  pathOptions={{
                    color: '#38bdf8',
                    fillColor: '#38bdf8',
                    fillOpacity: 0.6,
                    weight: 1,
                  }}
                >
                  <Tooltip>
                    <span style={{ fontWeight: 600, fontSize: '10px' }}>
                      T+{pt.timeOffsetHours}h | {pt.speedKnots}kn @ {pt.headingDeg}°
                    </span>
                  </Tooltip>
                </Circle>
              ) : null
            ))}
          </>
        )}

        {/* Risk zone circles for high-risk icebergs */}
        {showRiskZones && icebergPositions
          .filter(ice => ice.riskLevel === 'high' || ice.riskLevel === 'critical')
          .map(ice => (
            <Circle
              key={`risk-${ice.id}`}
              center={[ice.currentPos.lat, ice.currentPos.lng]}
              radius={15000}
              pathOptions={{
                color: RISK_COLORS[ice.riskLevel],
                fillColor: RISK_COLORS[ice.riskLevel],
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '6 4',
              }}
            />
          ))
        }

        {/* Uncertainty corridor for selected iceberg */}
        {showTrajectory && selectedIceberg?.uncertaintyCorridor && (
          <>
            <Polyline
              positions={selectedIceberg.uncertaintyCorridor.confidence80.map(p => [p[1], p[0]] as [number, number])}
              pathOptions={{
                color: '#0ea5e9',
                weight: 1,
                opacity: 0.3,
                fillColor: '#0ea5e9',
                fillOpacity: 0.05,
                fill: true,
                dashArray: '4 3',
              }}
            />
            <Polyline
              positions={selectedIceberg.uncertaintyCorridor.confidence95.map(p => [p[1], p[0]] as [number, number])}
              pathOptions={{
                color: '#0ea5e9',
                weight: 1,
                opacity: 0.15,
                dashArray: '3 5',
              }}
            />
          </>
        )}

        {/* Conflict point marker for Route A */}
        {showRoutes && routes
          .filter(r => r.conflictPoint)
          .map(r => (
            <Circle
              key={`conflict-${r.id}`}
              center={[r.conflictPoint![1], r.conflictPoint![0]]}
              radius={8000}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '5 3',
              }}
            >
              <Tooltip>
                <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '11px' }}>
                  ⚠ Collision Risk Zone — T+{r.conflictTimeHours}h
                </span>
              </Tooltip>
            </Circle>
          ))
        }
      </MapContainer>

      {/* Map Legend Overlay */}
      {!compact && (
        <div style={{
          position: 'absolute',
          bottom: 30,
          right: 10,
          zIndex: 1000,
          background: 'rgba(10, 14, 26, 0.92)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          borderRadius: '8px',
          padding: '10px 12px',
          backdropFilter: 'blur(8px)',
          fontSize: '10px',
          color: '#94a3b8',
          minWidth: '140px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '6px' }}>
            Legend
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9' }} />
              <span>Vessel</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span>Safe Iceberg</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              <span>Moderate Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
              <span>High Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 20, height: 2, background: '#22c55e' }} />
              <span>Safe Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 20, height: 2, background: '#ef4444', borderTop: '2px dashed #ef4444' }} />
              <span>Risk Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 20, height: 2, background: '#38bdf8' }} />
              <span>Predicted Path</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 20, height: 2, background: '#64748b', borderTop: '2px dashed #64748b' }} />
              <span>Historical Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
